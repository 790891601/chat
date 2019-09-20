<script src="<?php echo ADMIN_PATH;?>/lib/bootstrap/js/bootstrap.js"></script>
<script charset="utf-8" src="<?php echo ADMIN_ASSETS_PATH; ?>/plugins/editor/kindeditor/kindeditor-all.js"></script>
<script type="text/javascript">
    $("[rel=tooltip]").tooltip();
    $(function() {
        $('.demo-cancel-click').click(function(){return false;});
    });
    KindEditor.ready(function(K) {
        window.editor = K.create('#editor_id');

        var options = {
	        cssPath : '../css/index.css',
	        filterMode : true
		};
		var editor = K.create('textarea[name="content"]', options);
    });
</script>
<script src="<?php echo ADMIN_PATH . "/js/common.js" ?>"></script>