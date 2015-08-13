// created by yuanoook
// dependences: Zepto.js

+function(window){
    window.rangoUploader = Uploader;

	function Uploader(params){
        this.config(params);
        this.initialize();
    }

    Uploader.prototype.config = function(params){
        this.target = params.target;
        this.path = params.path;
        this.multiple = params.multiple || false;
        this.multipleSize = params.multipleSize || 1;
        this.uploading = params.uploading || function( persent ){ console.log('已经上传：' +(persent*100) + '%') };
        this.start = params.start || function(){ console.log('正在开始上传') };
        this.success = params.success;
        this.failed = params.failed || function(err){ alert(err) };
        this.appenddata = params.appenddata || {};
        this.ajaxconfig = params.ajaxconfig || {};
        this.filefiled = params.filefiled || 'file';
    }

    Uploader.prototype.initialize = initialize;

    function initialize(){
        var Me = this,
            url,
            formdata,
            ajaxparams,
            input = $('<input class="hide">').attr({
                type: 'file',
                accept: 'image/*'
            }),
            target = $(this.target);

            if( Me.multiple ){
                input.attr({
                    multiple: 'multiple'
                });
            };

            input.appendTo( $('body') );

        //fastClick.js 会导致 click 失效，采用 touchend 事件
        target.off('touchend').on('touchend', function(){
            reset();
            input.click();
        });

        input.on('change', function(){
            var files = this.files || [];
            if(!files.length){
                return console.log('你没有选择任何文件');
            }

            files = Array.prototype.splice.call(files, 0, Me.multipleSize);
            Array.prototype.forEach.call(files, function(file){
                upload(file);
            });
        });

        function upload(file){
            var xhr;
            var key = +new Date + '' + Math.random();

            if( !/^image\//.test(file.type)){
                return Me.failed( '你上传的不是图片！', key );
            }

            if( file.size > 1000000 ){
                return Me.failed( '图片不能超过 1M', key );
            }

            if( !window.FormData ){
                return Me.failed( '不支持 FormData', key );
            }

            url = window.URL && window.URL.createObjectURL && window.URL.createObjectURL(file);

            //表单开始咯
            formdata = new FormData();
            //添加主文件字段
            formdata.append( Me.filefiled, file );
            //添加额外字段
            for( i in Me.appenddata ){
                formdata.append( i, Me.appenddata[i] );
            }

            // ajax 开始咯
            xhr = new window.XMLHttpRequest();
            //额外配置 ajax
            var xhrfields = (Me.ajaxconfig && Me.ajaxconfig && Me.ajaxconfig.xhrFields) || {};
            for( i in xhrfields ){
                xhr[i] = xhrfields[i];
            }
            xhr.upload.addEventListener('progress', function(event){
                Me.uploading( event.loaded/event.total, key );
            });
            xhr.onreadystatechange = function () {
                if( xhr.readyState == 4 ){
                    if( xhr.status == 200 ){
                        Me.success( this.responseText, key );
                    }else{
                        Me.failed( '上传失败', key );
                    }
                }
            }
            //开始传输
            Me.start(url, key);
            xhr.open('POST', Me.path);
            xhr.send(formdata);
        }

        function reset(){
            input.val('');
        }
    }
}(window);