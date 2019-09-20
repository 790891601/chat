<?php
class DB {
	private $host;
	private $port;
	private $user;
	private $password;
	private $pre = "pre_";
	private $dbname;
	private $db;
	private $sql = "";

	public function __construct($config) {
		$host = $this -> host = isset($config['host']) ? $config['host'] : 'localhost';
		$port = $this -> port = isset($config['port']) ? $config['port'] : '3306';
		$user = $this -> user = isset($config['user']) ? $config['user'] : 'root';
		$password = $this -> password = isset($config['password']) ? $config['password'] : '';
		$dbname = $this -> dbname = isset($config['dbname']) ? $config['dbname'] : '';


		$this -> db = mysqli_connect($host, $user, $password, $dbname, $port);

		//设置字符编码
		mysqli_query($this -> db, 'SET NAMES UTF8');
	}

	//删除
	public function del($table, $where) {
		$explode = explode(",", $where);
		$where = implode(",", $explode);

		$sql = "delete from `{$this ->pre}{$table}` WHERE id in($where) ";

		$res = mysqli_query($this -> db, $sql);

		if(!$res) {
			$this -> error(); die;
		}

		return true;
	}

	//保存数据
	public function save($table, $data, $where = false) {
		$value = "";
		if($where) {
			foreach ($data as $key => $val) {
				$value .= "`$key` = '$val', ";
			}	
			$value = rtrim($value, ", ");

			$sql = "update {$this ->pre}{$table} set $value where $where";
		}else {
			$fields = "";
			foreach ($data as $key => $val) {
				$fields .= "`$key`,";
				$value .= "'$val',";
			}
			$value = rtrim($value, ",");
			$fields = rtrim($fields, ",");
			
			$sql = "insert into {$this ->pre}{$table} ($fields) values ($value)";
		}
		
		$res = mysqli_query($this -> db, $sql);

		if(!$res) {
			$this -> error(); die;
		}

		return mysqli_affected_rows($this -> db);
	}

	public function select($fields = "*") {
		$this -> sql .= "SELECT {$fields} ";
		return $this;
	}

	public function all() {
		$res = mysqli_query($this -> db, $this -> sql);
		
		if(!$res) {
			$this -> error(); die;
		}

		$arr = array();
		while($row = mysqli_fetch_assoc($res)) {
			$arr[] = $row;
		}

	

		$this -> sql = "";

		return $arr;
	}

	public function from($table) {
		$this -> sql .= "FROM `{$this -> pre}{$table}` as $table ";
		return $this;
	}

	public function orderBy($field = "", $by = "asc") {
		if(!in_array($by, array('asc', 'desc'))) {
			$by = "asc";
		}

		$this -> sql .= "ORDER BY {$field} {$by} ";

		return $this;
	}

	public function limit($offset = 0, $limit = 10) {
		$this -> sql .= "LIMIT {$offset},{$limit} ";

		return $this;
	}

	public function where($where){
		if(is_array($where)) {
			$sql = "";
			foreach ($where as $key => $value) {
				$sql .= "{$key} = '{$value}' AND ";	
			}

			$sql = trim($sql, "AND ");

			$this -> sql .= "WHERE {$sql} ";

			return $this;
		}

		$this -> sql .= "WHERE {$where} ";

		return $this;
	}

	//连表查询
	public function join($table, $on, $by= 'left') {
		//left join $table on $on
		$this -> sql .= "$by JOIN {$this->pre}$table as $table on $on ";
		return $this; 
	}

	//查询一条
	public function find() {
		$res = mysqli_query($this -> db, $this -> sql);

		if(!$res) {
			$this -> error(); die;
		}

		$this -> sql = "";

		return mysqli_fetch_assoc($res);
	}

	//增加多条
	public function addAll($table, $data) {
		$res = mysqli_query($this -> db, "desc {$this ->pre}$table");

		$tableFields = array();;
		while($row = mysqli_fetch_assoc($res)) {
			if($row['Key'] == 'PRI') {
				continue;
			}

			$tableFields [] = $row['Field'];
		}

		//拿到非主键字段名
		sort($tableFields);
		$fields = "`" . implode("`,`", $tableFields) . "`";

		$dataArr = array();
		foreach ($data as $key => $item) {
			ksort($item);
			$dataArr[] = "'" . implode("','", $item) . "'";
		}

		$dataStr = "";
		if(count($dataArr) > 0) {
			$dataStr = "(" . implode("),(", $dataArr) . ")";
		}


		$sql = "insert into {$this -> pre}$table ({$fields}) values $dataStr";
		$res = mysqli_query($this -> db, $sql);

	    if(!$res) {
	      $this -> error();
	      return false;
	    }

	    return mysqli_affected_rows($this -> db);
	}

	public function getSQL() {
		return $this -> sql;
	}

	public function error(){
	    $error = mysqli_error($this -> db);
	    $message = "[" . date("Y-m-d H:i") . "] SQL错误：" . $error . "\r\n";
	    
	    //写入
	    $filename = APP_PATH . "/includes/extends/mysql_error.log";
	    file_put_contents($filename, $message, FILE_APPEND);

	    echo "SQL语句执行失败"; die;
	}
}