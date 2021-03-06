/**
 * Created by simonykq on 01/02/2015.
 */
var PROJECT_TREE_ROUTE = (function(){

    var commitData,
        ownerName,
        projectName,
        commitId,
        projectPath;

    function loadCommit(){

        var path = '/api/user/' + ownerName + '/project/' + projectName + '/git/treeinfo/' + commitId + '/' + projectPath;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            success: function(data){
                if(data.data){
                    commitData = data.data;
                    assembleCommitDOM(commitData);
                }else{
                    alert('Failed to load commits');
                }
            },
            error: function(xhr, type){
                alert('Failed to load commits');
            },
            complete: function(){
                $('div.loading').remove();
            }
        });
    }

    function assembleCommitDOM(commit){
        var files = commit.infos;

        var file    = null,
            fileEle = null;
        for (var i = 0; i < files.length; i++) {
            file = files[i];
            fileEle = createFileDOM(file);
            $('#project_code > .list-group').append(fileEle);
        }
    }

    function createFileDOM(file){
        var template = '<a class="list-group-item project_item">' +
                            '<img src="#" height="25" width="23" >' +
                            '<div class="item_details">' +
                                '<span class="item_name"></span>' +
                                '<br />' +
                                '<span class="item_note"></span>' +
                            '</div>' +
                            '<span class="item_arrow pull-right glyphicon glyphicon-chevron-right"></span>' +
                        '</a>',
            ele      = $(template),
            link     = file['mode'] === 'tree' ? '/u/' + ownerName + '/p/' + projectName + '/tree/' + commitId + '/' + file['path'].replace(/\//g,'%2F') : '/u/' + ownerName + '/p/' + projectName + '/blob/' + commitId + '/' + file['path'].replace(/\//g,'%2F'),
            image    = file['mode'] === 'tree' ? '/images/static/folder.png' : '/images/static/file.png';

        ele.attr('href',link);

        ele.find('img').attr('src', image);
        ele.find('span.item_name').text(truncateText(file['name'],25));

        ele.find('span.item_note').text(moment(file['lastCommitDate']).fromNow() + ' ' + file['lastCommitter']['name']);

        return ele;
    }

    function truncateText(text, length){
        return text.length < length ? text : text.substr(0,length) + '...';
    }

    function loadProject(){
        var path = '/api/user/' + ownerName + '/project/' + projectName;
        var successed = function(data){
            if(data.data){
                coding.showProjectBreadcrumb(data.data);
            }
        }
       coding.get(path,successed);
    }
    return {
        template_url: '/views/project_tree.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, project){

            var path =  '/u/' + user + '/p/' +  project;
            //active the project navbar item
            $('#navigator').find('li:first').addClass('active');

            //add the project header and navigation bar
            var 
                project_nav =  '<div class="row project_header nested">' +
                    '<div class="col-xs-3">' +
                    '<a href="#">项目主页</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">阅读代码</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">合并请求</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">项目讨论</a>' +
                    '</div>' +
                    '</div>',
                
                nav_ele     = $(project_nav);

            nav_ele.find('div').eq(0).children('a').attr('href', path + '/git');
            nav_ele.find('div').eq(1).children('a').attr('href', path + '/tree');
            nav_ele.find('div').eq(2).children('a').attr('href', path + '/pull');
            nav_ele.find('div').eq(3).children('a').attr('href', path + '/topics');

            //active the current tab
            nav_ele.find('div').eq(1).addClass('active');

            $("nav.main-navbar").after(nav_ele);
            
        },
        on_enter: function(user, project, commit, path){
            
            ownerName = user;
            projectName = project;
            commitId = commit || 'master';
            projectPath = (path || '').replace(/%2F/g,'/');
            loadProject();
            loadCommit();

        },
        on_exit: function(user, project){
            coding.showBanner();
            $('#navigator').find('li').removeClass('active');

            $('.project_navbar').remove();
            $('.project_header').remove();
        }
    }
})();
