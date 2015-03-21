(function(){var a,b,c=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1},d=[].slice;window.Routy||(window.Routy={}),a=window.History,b={},Routy.Router=function(){function a(a,b,c,d){this.state_changers_selector=b,this.event=d,a||(a=""),""!==a&&("/"===a[0]&&(a=a.substr(1)),"/"===a.substr(-1)&&(a=a.substr(0,a.length-1))),this.context=a,this.state_changers_selector||(this.state_changers_selector="a"),c||(c=document),this.context_selector=$(c),this.event||(this.event="click"),this.attach()}return a.prototype.actions=[],a.prototype.apply_context=function(a){return a=""!==a?"/"!==a[0]?this.context+a:this.context+a:this.context+"/"},a.prototype.attach=function(){var a;return a=this,$(window).load(function(){return a.run.call(a,window.location.pathname)}),this.context_selector.on(this.event,this.state_changers_selector,function(b){var c;if(c=$(this).attr("href")||$(this).children("a").attr("href")||"",0===c.indexOf("http://")||0===c.indexOf("https://")||""===c);else if(b.preventDefault(),null!=c)return a.run.call(a,c,b.type)}),$(window).bind("popstate",function(b){return a.run.call(a,b.state.state)})},a.prototype.go=function(a,b,c){var d;return d=c||{},d.state=a,window.history.pushState(d,b||document.title,a)},a.prototype.register=function(a,b){var c,d,e,f,g,h,i,j;return j=b.template_url,g=b.events||this.event.split(" "),e=b.context,d=b.before_enter,f=b.on_enter,c=b.after_enter,h=b.on_exit,i=new Routy.Action(a,j,g,$(e),this,d,f,c,h),this.actions.push(i)},a.prototype.rootRegister=function(a){return this.register("/",a)},a.prototype.run=function(a,b){var d,e,f,g,h,i,j,k,l,m;for(this.check_login_status(),l=this.actions,h=0,j=l.length;j>h;h++)if(d=l[h],!b||b&&c.call(d.events,b)>=0)for(m=d.route,i=0,k=m.length;k>i;i++)if(g=m[i],f=this.pathRegExp(g,{}).regexp,e=a.match(f),null!=e)return this.go(a),e.shift(),d.call.apply(d,e);return this.run("/")},a.prototype.check_login_status=function(){var a=this;return $.ajax({url:API_DOMAIN+"/api/current_user",dataType:"json",xhrFields:{withCredentials:!0},async:!1,success:function(b){b.data&&(a.current_user||(a.current_user=b.data,a.updateDOM(a.current_user)))},error:function(){alert("Failed to load current user")}})},a.prototype.updateDOM=function(a){var b,c;return $("#navigator a.login").removeClass("btn-success").removeClass("login").removeAttr("href").addClass("btn-danger").addClass("logout").text("退出登录").click(function(){return $.ajax({url:API_DOMAIN+"/api/logout",type:"POST",dataType:"json",xhrFields:{withCredentials:!0},success:function(){return location.reload()},error:function(){return alert("Failed to logout")}})}),c='<li>                        <a class="items" href="#">                            <img class="current_user" src="#" height="35" width="35" />                            <span></span>                            <img class="right_arrow" src="/images/static/right_arrow.png" height="20" width="20" />                        </a>                    </li>',b=$(c),b.find("a.items").attr("href","/user/"+a.global_key),b.find("img.current_user").attr("src",a.avatar),b.find("span").text(a.name),$("li.divider").before(b)},a.prototype.pathRegExp=function(a,b){var c,d,e;return c=b.caseInsensitiveMatch,e={originalPath:a,regexp:a},d=e.keys=[],a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,b,c,e){var f,g;return f="?"===e?e:null,g="*"===e?e:null,d.push({name:c,optional:!!f}),b=b||"",""+(f?"":b)+"(?:"+(f?b:"")+(g&&"(.+?)"||"([^/]+)")+(f||"")+")"+(f||"")}).replace(/([\/$\*])/g,"\\$1"),e.regexp=new RegExp("^"+a+"$",c?"i":""),e},a}(),Routy.Action=function(){function a(a,b,c,d,e,f,g,h,i){var j,k,l,m;for(this.template_url=b,this.events=c,this.context=d,this.router=e,this.before_callback=f,this.callback=g,this.after_callback=h,this.on_exit_callback=i,"string"==typeof a&&(a=a.split(", ")),j=[],this.events=this.events||[],l=0,m=a.length;m>l;l++)k=a[l],k=this.router.apply_context(k),j.push(k);this.route=j}return a.prototype.route=[],a.prototype.context=$("body"),a.prototype.template_url=null,a.prototype.template=null,a.prototype.callback=null,a.prototype.before_callback=null,a.prototype.after_callback=null,a.prototype.condition=null,a.prototype.on_exit_callback=null,a.prototype.events=[],a.prototype.call=function(){var a,b,c=this;return a=1<=arguments.length?d.call(arguments,0):[],b=!0,this.condition&&(b=this.condition.apply(this,a)),this.template?this.digest(a):$.get(this.template_url,function(b){return c.template=b,c.digest(a)})},a.prototype.digest=function(a){return null!=b.on_exit_callback&&b.on_exit_callback.apply(this,a),this.before_callback&&this.before_callback.apply(this,a),this.context.html(this.template),this.callback.apply(this,a),this.after_callback&&this.after_callback.apply(this,a),b=this},a}()}).call(this);var LOGIN_ROUTE=function(){return{template_url:"/views/login.html",context:".container",on_enter:function(){$.ajax({url:API_DOMAIN+"/api/captcha/login",dataType:"json",success:function(a){if(a.data){var b='<div class="form-group"><div class="input-group"><input type="text" class="form-control" name="j_captcha" placeholder="验证码"><div class="input-group-addon" style="padding: 0"><img class="captcha" height="30" src="https://coding.net/api/getCaptcha"></div></div></div>',c=$(b);$("div.checkbox").before(c)}}}),$("form.login").submit(function(a){a.preventDefault();var b=$('input[name="password"]'),c=CryptoJS.SHA1(b.val());b.val(c),$.ajax({url:API_DOMAIN+"/api/login",type:"POST",dataType:"json",data:$(this).serialize(),xhrFields:{withCredentials:!0},success:function(a){if(a.data&&router.run.call(router,"/"),a.msg)for(var b in a.msg)alert(a.msg[b])},error:function(){alert("Failed to login")}})})}}}(),PROJECT_TOPICS_ROUTE=function(){function a(a){var b='<li class="list-group-item title" role="tab"><a data-toggle="collapse" data-parent="#project_topic" data-target="" aria-expanded="true"><img src="#" height="35" width="35"><div><strong></strong><br /><b></b><span></span><span></span></div></a><div id="" class="collapse" role="tabpanel"><div class="panel-body"></div></div></li>',c=$(b);return c.find("a").attr("data-target","#topic_"+a.id),c.find("a > img").attr("src",e(a.owner.avatar)),c.find("a > div > strong").text(a.title),c.find("a > div > b").text(" "+a.owner.name+" "),c.find("a > div > span:eq(0)").text(" 发布于"+moment(a.created_at).fromNow()+", "),c.find("a > div > span:eq(1)").text(" 有"+a.child_count+"条回应 "),c.find("div.collapse").attr("id","topic_"+a.id),c.find("div.collapse > div.panel-body").html(a.content),c}function b(b){var c,d,e=b.list||[],f=document.createDocumentFragment();d=document.getElementById("project_topic");for(var g=0;g<e.length;g++)c=a(e[g]),f.appendChild(c[0]);d.appendChild(f)}function c(a){var c=$("#load_more");c.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...'),a+="?pageSize="+j+"&page="+i+"&type="+k,$.ajax({url:API_DOMAIN+a,dataType:"json",xhrFields:{withCredentials:!0},success:function(a){a.data&&(b(a.data),i++)},error:function(){alert("Failed to load pulls")},complete:function(){c.text("更多评论")}})}function d(){i=1,j=10,k=1}function e(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}var f,g,h,i=1,j=10,k=1;return{template_url:"/views/project_topics.html",context:".container",before_enter:function(a,b){var c="/u/"+a+"/p/"+b;$("#navigator").find("li:first").addClass("active");var d='<nav class="project_navbar navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#"><img alt="left" src="/images/static/left_arrow.png" height="20" width="20"></a><span class="text-center"></span></div></div></nav>',e='<div class="row project_header"><div class="col-xs-3"><a href="#">项目主页</a></div><div class="col-xs-3"><a href="#">阅读代码</a></div><div class="col-xs-3"><a href="#">合并请求</a></div><div class="col-xs-3"><a href="#">项目讨论</a></div></div>',f=$(d),g=$(e);f.find("a.navbar-brand").attr("href","/projects"),f.find("span").text(b),g.find("div").eq(0).children("a").attr("href",c+"/git"),g.find("div").eq(1).children("a").attr("href",c+"/tree"),g.find("div").eq(2).children("a").attr("href",c+"/pull"),g.find("div").eq(3).children("a").attr("href",c+"/topics"),g.find("div").eq(3).addClass("active"),$("nav.main-navbar").after(f),f.after(g),$.ajax({url:API_DOMAIN+"/api/user/"+a+"/project/"+b,dataType:"json",async:!1,success:function(a){a.data?h=a.data:alert("Failed to load project")},error:function(){alert("Failed to load project")}})},on_enter:function(a,b){f=a,g=b;var d="/api/project/"+h.id+"/topics";c(d),$("#load_more").on("click",function(a){a.preventDefault(),c(d)})},on_exit:function(){$("#navigator").find("li").removeClass("active"),$(".project_navbar").remove(),$(".project_header").remove(),d()}}}(),PROJECT_PULL_ROUTE=function(){function a(a){var c,d,e=a.list||[],f=document.createDocumentFragment();d=document.getElementById("project_pull");for(var g=0;g<e.length;g++)c=b(e[g]),f.appendChild(c[0]);d.appendChild(f)}function b(a){var b='<li class="list-group-item title"><h6></h6><p><b></b>  <span class="label"></span></p><div><img src="#" height="20" width="20" /><span></span></div></li>',c=$(b);c.find("h6").text("#"+a.iid+" "+a.title),c.find("p > b").text(a.source_owner_name+":"+a.srcBranch+" -> "+g+":"+a.desBranch);var d=c.find("p > span.label");return"ACCEPTED"===a.merge_status?(d.addClass("label-warning"),d.text("已合并")):"REFUSED"===a.merge_status?(d.addClass("label-danger"),d.text("已拒绝")):"CANNOTMERGE"===a.merge_status?(d.addClass("label-info"),d.text("不可合并")):"OPEN"===a.merge_status&&(d.addClass("label-success"),d.text("未处理")),c.find("div > img").attr("src",f(a.author.avatar)),c.find("div > span").text(" 创建于"+moment(a.created_at).fromNow()),c}function c(b){var c=$("#load_more");c.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...'),b+="/"+j+"?page="+i,$.ajax({url:API_DOMAIN+b,dataType:"json",xhrFields:{withCredentials:!0},success:function(b){b.data&&(a(b.data),i++)},error:function(){alert("Failed to load pulls")},complete:function(){c.text("更多合并请求")}})}function d(a){i=1,j=a}function e(a){$("#project_pull > li.title").remove(),c(a)}function f(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}var g,h,i=1,j="open";return{template_url:"/views/project_pull.html",context:".container",before_enter:function(a,b){var c="/u/"+a+"/p/"+b;$("#navigator").find("li:first").addClass("active");var d='<nav class="project_navbar navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#"><img alt="left" src="/images/static/left_arrow.png" height="20" width="20"></a><span class="text-center"></span></div></div></nav>',e='<div class="row project_header"><div class="col-xs-3"><a href="#">项目主页</a></div><div class="col-xs-3"><a href="#">阅读代码</a></div><div class="col-xs-3"><a href="#">合并请求</a></div><div class="col-xs-3"><a href="#">项目讨论</a></div></div>',f=$(d),g=$(e);f.find("a.navbar-brand").attr("href","/projects"),f.find("span").text(b),g.find("div").eq(0).children("a").attr("href",c+"/git"),g.find("div").eq(1).children("a").attr("href",c+"/tree"),g.find("div").eq(2).children("a").attr("href",c+"/pull"),g.find("div").eq(3).children("a").attr("href",c+"/topics"),g.find("div").eq(2).addClass("active"),$("nav.main-navbar").after(f),f.after(g)},on_enter:function(a,b){g=a,h=b;var f="/api/user/"+a+"/project/"+b+"/git/pulls";c(f),$("#load_more").on("click",function(a){a.preventDefault(),c(f)}),$("select.status").on("change",function(a){a.preventDefault(),d($(this).val()),e(f)})},on_exit:function(){$("#navigator").find("li").removeClass("active"),$(".project_navbar").remove(),$(".project_header").remove(),d("open")}}}(),PROJECT_BLOB_ROUTE=function(){function a(){var a="/api/user/"+e+"/project/"+f+"/git/blob/"+g+"/"+h;$.ajax({url:API_DOMAIN+a,dataType:"json",success:function(a){a.data?(d=a.data,b(d)):alert("Failed to load commits")},error:function(){alert("Failed to load commits")},complete:function(){$("div.loading").remove()}})}function b(a){var b=a.file;if("file"===b.mode){var d=c(b.data),h=b.lang,i=hljs.getLanguage(h)?hljs.highlight(h,d):hljs.highlightAuto(d);$("code.hljs").html(i.value)}else{var j=b.path,k=API_DOMAIN+"/u/"+e+"/p/"+f+"/git/raw/"+g+"/"+j;$("pre").replaceWith('<div class="text-center"><img width="300" src='+k+"></div>")}}function c(a){var b={lt:"<",gt:">",nbsp:" ",amp:"&",quot:'"'};return a.replace(/&(lt|gt|nbsp|amp|quot);/gi,function(a,c){return b[c]})}var d,e,f,g,h;return{template_url:"/views/project_blob.html",context:".container",before_enter:function(a,b){var c="/u/"+a+"/p/"+b;$("#navigator").find("li:first").addClass("active");var d='<nav class="project_navbar navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#"><img alt="left" src="/images/static/left_arrow.png" height="20" width="20"></a><span class="text-center"></span></div></div></nav>',e='<div class="row project_header"><div class="col-xs-3"><a href="#">项目主页</a></div><div class="col-xs-3"><a href="#">阅读代码</a></div><div class="col-xs-3"><a href="#">合并请求</a></div><div class="col-xs-3"><a href="#">项目讨论</a></div></div>',f=$(d),g=$(e);f.find("a.navbar-brand").attr("href","/projects"),f.find("span").text(b),g.find("div").eq(0).children("a").attr("href",c+"/git"),g.find("div").eq(1).children("a").attr("href",c+"/tree"),g.find("div").eq(2).children("a").attr("href",c+"/pull"),g.find("div").eq(3).children("a").attr("href",c+"/topics"),g.find("div").eq(1).addClass("active"),$("nav.main-navbar").after(f),f.after(g)},on_enter:function(b,c,d,i){e=b,f=c,g=d||"master",h=(i||"").replace(/%2F/g,"/"),a()},on_exit:function(){$("#navigator").find("li").removeClass("active"),$(".project_navbar").remove(),$(".project_header").remove()}}}(),PROJECT_TREE_ROUTE=function(){function a(){var a="/api/user/"+f+"/project/"+g+"/git/treeinfo/"+h+"/"+i;$.ajax({url:API_DOMAIN+a,dataType:"json",success:function(a){a.data?(e=a.data,b(e)):alert("Failed to load commits")},error:function(){alert("Failed to load commits")},complete:function(){$("div.loading").remove()}})}function b(a){for(var b=a.infos,d=null,e=null,f=0;f<b.length;f++)d=b[f],e=c(d),$("#project_code > .list-group").append(e)}function c(a){var b='<li class="list-group-item list-group-item-info project_item"><img src="#" height="25" width="23" ><div class="item_details"><span class="item_name"></span><br /><span class="item_note"></span></div><a href="#" class="item_arrow pull-right glyphicon glyphicon-chevron-right"></a></li>',c=$(b),e="tree"===a.mode?"/u/"+f+"/p/"+g+"/tree/"+h+"/"+a.path.replace(/\//g,"%2F"):"/u/"+f+"/p/"+g+"/blob/"+h+"/"+a.path.replace(/\//g,"%2F"),i="tree"===a.mode?"/images/static/folder.png":"/images/static/file.png";return c.find("img").attr("src",i),c.find("span.item_name").text(d(a.name,25)),c.find("a.item_arrow").attr("href",e),c.find("span.item_note").text(moment(a.lastCommitDate).fromNow()+" "+a.lastCommitter.name),c}function d(a,b){return a.length<b?a:a.substr(0,b)+"..."}var e,f,g,h,i;return{template_url:"/views/project_tree.html",context:".container",before_enter:function(a,b){var c="/u/"+a+"/p/"+b;$("#navigator").find("li:first").addClass("active");var d='<nav class="project_navbar navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#"><img alt="left" src="/images/static/left_arrow.png" height="20" width="20"></a><span class="text-center"></span></div></div></nav>',e='<div class="row project_header"><div class="col-xs-3"><a href="#">项目主页</a></div><div class="col-xs-3"><a href="#">阅读代码</a></div><div class="col-xs-3"><a href="#">合并请求</a></div><div class="col-xs-3"><a href="#">项目讨论</a></div></div>',f=$(d),g=$(e);f.find("a.navbar-brand").attr("href","/projects"),f.find("span").text(b),g.find("div").eq(0).children("a").attr("href",c+"/git"),g.find("div").eq(1).children("a").attr("href",c+"/tree"),g.find("div").eq(2).children("a").attr("href",c+"/pull"),g.find("div").eq(3).children("a").attr("href",c+"/topics"),g.find("div").eq(1).addClass("active"),$("nav.main-navbar").after(f),f.after(g)},on_enter:function(b,c,d,e){f=b,g=c,h=d||"master",i=(e||"").replace(/%2F/g,"/"),a()},on_exit:function(){$("#navigator").find("li").removeClass("active"),$(".project_navbar").remove(),$(".project_header").remove()}}}(),PROJECT_ITEM_ROUTE=function(){function a(){var a="/api/user/"+g+"/project/"+h;$.ajax({url:API_DOMAIN+a,dataType:"json",success:function(a){a.data?(f=a.data,$("#project_readme").before(c(f))):alert("Failed to load project")},error:function(){alert("Failed to load project")}})}function b(){var a="/api/user/"+g+"/project/"+h+"/git/tree/master";$.ajax({url:API_DOMAIN+a,dataType:"json",success:function(a){if(a.data){var b=a.data.readme.preview;$("#readme_body > .panel-body").html(b)}else alert("Failed to load README file")},error:function(){alert("Failed to load README file")},complete:function(){$("span.loading").remove()}})}function c(a){var b='<div class="project_content row"><div class="col-xs-4 col-md-2"><img src="#" height="100" width="100"></div><div class="col-xs-8 col-md-5 description"><h4></h4><p></p><div><img src="#" height="20" width="20" /><span> 最后更新于 </span></div></div></div>',c=$(b);return c.find("img").eq(0).attr("src",d(a.icon)),c.find(".description h4").text(a.name),c.find(".description p").text(e(a.description,40)),c.find(".description img").attr("src",d(a.owner_user_picture)),c.find(".description span").text(" 最后更新于"+moment(a.updated_at).fromNow()),c}function d(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}function e(a,b){return a.length<b?a:a.substr(0,b)+"..."}var f,g,h;return{template_url:"/views/project_item.html",context:".container",before_enter:function(a,b){var c="/u/"+a+"/p/"+b;$("#navigator").find("li:first").addClass("active");var d='<nav class="project_navbar navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#"><img alt="left" src="/images/static/left_arrow.png" height="20" width="20"></a><span class="text-center"></span></div></div></nav>',e='<div class="row project_header"><div class="col-xs-3"><a href="#">项目主页</a></div><div class="col-xs-3"><a href="#">阅读代码</a></div><div class="col-xs-3"><a href="#">合并请求</a></div><div class="col-xs-3"><a href="#">项目讨论</a></div></div>',f=$(d),g=$(e);f.find("a.navbar-brand").attr("href","/projects"),f.find("span").text(b),g.find("div").eq(0).children("a").attr("href",c+"/git"),g.find("div").eq(1).children("a").attr("href",c+"/tree"),g.find("div").eq(2).children("a").attr("href",c+"/pull"),g.find("div").eq(3).children("a").attr("href",c+"/topics"),g.find("div").eq(0).addClass("active"),$("nav.main-navbar").after(f),f.after(g)},on_enter:function(c,d){g=c,h=d,a(),b()},on_exit:function(){$("#navigator").find("li").removeClass("active"),$(".project_navbar").remove(),$(".project_header").remove()}}}(),PROJECT_ROUTE=function(){function a(a){var c,d,a=a||{},e=a.list,f=document.createDocumentFragment();j=document.getElementById("projects_list");for(var g=0;g<e.length;g++)c=e[g],d=b(c),f.appendChild(d[0]),k.push(c);j.appendChild(f)}function b(a){var b='<a href="#" class="list-group-item needsclick" style="height: 105px"><img class="pull-left project_icon" src="#" width="80" height="80"><span class="project_name"></span><br /><span class="project_description"></span><br /><div class="project_owner"><img src="#" height="15" width="14" /><span> 最后更新于 </span></div></a>',c=$(b);return c.attr("href",a.project_path),c.find("img.project_icon").attr("src",f(a.icon)),c.find("span.project_name").text(a.name),c.find("span.project_description").text(g(a.description,15)),c.find("div.project_owner > img").attr("src",f(a.owner_user_picture)),c.find("div.project_owner > span").text(" 最后更新于"+moment(a.updated_at).fromNow()),c}function c(b){i++;var c=$("#load_more");c.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...'),b+="?page="+i+"&pageSize="+h,$.ajax({url:API_DOMAIN+b,dataType:"json",xhrFields:{withCredentials:!0},success:function(b){b.data&&a(b.data)},error:function(){alert("Failed to load projects")},complete:function(){c.text("更多项目")}})}function d(){for(var a,c=document.createDocumentFragment(),d=document.getElementById("projects_list"),e=0;e<k.length;e++)a=b(k[e]),c.appendChild(a[0]);d.appendChild(c)}function e(){k=[],i=0}function f(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}function g(a,b){return a.length<b?a:a.substr(0,b)+"..."}var h=10,i=0,j=null,k=[],l="public",m="";return{template_url:"/views/project.html",context:".container",before_enter:function(a){$("#navigator").find("li:first").addClass("active");var b='<div class="row project_header"><div class="col-xs-6"><a href="#">精彩项目</a></div><div class="col-xs-6"><a href="#">我的项目</a></div>',c=$(b);c.find("div").eq(0).children("a").attr("href","/projects"),c.find("div").eq(1).children("a").attr("href","/projects/mine"),$("nav.main-navbar").after(c),"mine"===a?c.find("div").eq(1).addClass("active"):c.find("div").eq(0).addClass("active")},on_enter:function(a){if(m=a||"public",m!=l&&e(),!router.current_user&&"mine"===m)return void alert("You are not logged in");var b="public"===m?"/api/public/all":"/api/user/"+router.current_user.global_key+"/public_projects";0===k.length?c(b):d();var f=$("#load_more");f.on("click",function(a){a.preventDefault(),c(b)})},on_exit:function(){$("#navigator").find("li").removeClass("active"),$(".project_header").remove(),l=m}}}(),PP_ROUTE=function(){function a(a){var c,d=a||{},e=document.createDocumentFragment();j=document.getElementById("pp_list");for(var f=0;f<d.length;f++)c=b(d[f]),e.appendChild(c[0]),k[d[f].id]=d[f];j.appendChild(e)}function b(a){var e='<div class="detailBox"><div class="titleBox"><div class="commenterImage"><a href="#"><img src="#" height="30" width="30" /></a></div><a class="commenterName" href="#"></a><div class="commentedAt"></div></div><div class="commentBox"><p class="taskDescription"></p></div><div class="commenterDetail pull-left"></div><a href="#" class="pull-right comment"><span class="glyphicon glyphicon-comment"> 评论 </span></a><a href="#" class="pull-right star"><span class="glyphicon glyphicon-heart"> 赞 </span></a><br /><div class="actionBox"><div class="row"><div class="col-sm-12 like_users"></div></div><ul class="commentList"></ul><form class="form-inline commentSubmit" role="form"><div class="input-group"><input type="text" class="form-control" placeholder="在此输入评论内容"><span class="input-group-btn"><button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-arrow-right"></span></button></span></div></form></div></div>',f=$(e);f.attr("id",a.id);var h=a.owner.name,i=a.owner.global_key,j=a.device;if(router.current_user){var l=router.current_user.global_key;l===i&&f.find(".commentedAt").after('<a href="#" class="close pull-right" aria-label="Close"><span aria-hidden="true">&times;</span></a>')}f.find(".titleBox > .commenterImage > a").attr("href","/user/"+i),f.find(".titleBox > .commenterImage > a > img").attr("src",g(a.owner.avatar)),f.find(".titleBox > a.commenterName").attr("href","/user/"+i),f.find(".titleBox > a.commenterName").text(h),f.find(".titleBox > div.commentedAt").text(moment(a.created_at).fromNow()),""!==j&&f.find(".detailBox > div.commenterDetail").text("来自"+j),a.liked&&f.find(".detailBox > a.star > span").css("color","#D95C5C");for(var m,n=a.like_users,o=f.find(".actionBox .like_users"),p=0;p<n.length;p++)m=d(n[p]),o.append(m);var q=$(a.content),r=q.find("a.bubble-markdown-image-link");if(0!==r.length){r.removeAttr("target");var s=r.clone(),t=$("<p></p>");r.remove(),q.find("br").remove();var u=s.map(function(a,b){return b.outerHTML}).get().join("");if(t.html(u),s.length>1){{$("#pp_list").width()/4}t.addClass("thumbnail")}f.find(".commentBox > .taskDescription").html(q),f.find(".commentBox > .taskDescription > p:last").after(t)}else f.find(".commentBox > .taskDescription").html(q);for(var v,w=a.comment_list,x=f.find(".actionBox > .commentList"),y=0;y<w.length;y++)v=c(w[y]),x.append(v);return f.on("click",".star",function(c){c.preventDefault();var d=a.id,e=a.liked?"/api/tweet/"+d+"/unlike":"/api/tweet/"+d+"/like";return $.ajax({url:API_DOMAIN+e,type:"POST",dataType:"json",xhrFields:{withCredentials:!0},success:function(c){if(0===c.code){if(a.liked=!a.liked,a.liked?a.likes+=1:a.likes-=1,a.liked)a.like_users.push(router.current_user);else{for(var e,g,h=0;h<a.like_users.length;h++)if(g=a.like_users[h],g.global_key=router.current_user.global_key){e=h;break}a.like_users.splice(e,1)}var i=b(a);f.replaceWith(i),k[d]=a}if(c.msg)for(var j in c.msg)alert(c.msg[j])},error:function(){alert("Failed to lik_unlike pp")}}),!1}),f.on("click",".close",function(b){b.preventDefault();var c=confirm("确认删除该泡泡？");if(c){var d=a.id,e="/api/tweet/"+d;$.ajax({url:API_DOMAIN+e,type:"DELETE",xhrFields:{withCredentials:!0},success:function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);else delete k[d],f.remove()},error:function(){alert("Failed to delete comment")}})}return!1}),f.on("submit",".commentSubmit",function(b){b.preventDefault();var d=a.id,e=$(this).find("input"),f=$(this).find("button"),g="/api/tweet/"+d+"/comment";return $.ajax({url:API_DOMAIN+g,type:"POST",dataType:"json",data:{content:e.val()},xhrFields:{withCredentials:!0},success:function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);if(a.data){a.data.owner=router.current_user;var d=c(a.data);x.prepend(d)}},error:function(){alert("Failed to send comment")},complete:function(){e.val(""),e.removeAttr("disabled"),f.removeAttr("disabled")}}),e.attr("disabled","disabled"),f.attr("disabled","disabled"),!1}),f}function c(a){var b='<li><div class="commenterImage"><a href="#"><img src="#" /></a></div><div class="commentText"><p></p><a class="commenterName" href="#"><span class="comment-meta"></span></a><span class="date sub-text"></span><a class="reply" href="#" class="comment-hash"> 回复 </a></div></li>',c=$(b),d=a.owner.name,e=a.owner.global_key;if(router.current_user){var f=router.current_user.global_key;f===e&&c.find(".reply").after('<a class="delete" href="#" class="comment-hash"> 删除 </a>')}return c.find(".commenterImage img").attr("src",g(a.owner.avatar)),c.find("a.commenterName").attr("href","/user/"+e),c.find("a.commenterName > span").text(d),c.find(".commentText > p").html(a.content),c.find(".commentText > .date").text(moment(a.created_at).fromNow()),c.find(".commentText > a").attr("id",a.owner_id),c.on("click",".reply",function(a){a.preventDefault();var b=c.parents(".commentList").next("form").find("input");if(""===b.val())b.val("@"+d);else{var e=b.val();b.val(e+", @"+d)}return!1}),c.on("click",".delete",function(b){b.preventDefault();var d=confirm("确认删除该评论？");if(d){var e=c.parents(".detailBox").attr("id"),f=a.id,g="/api/tweet/"+e+"/comment/"+f;$.ajax({url:API_DOMAIN+g,type:"DELETE",xhrFields:{withCredentials:!0},success:function(a){if(a.msg)for(var b in a.msg)alert(a.msg[b]);else{for(var d=k[e].comment_list,g=d.length-1;g>=0;g--)d[g].id===f&&d.splice(g,1);c.remove()}},error:function(){alert("Failed to delete comment")}})}return!1}),c}function d(a){var b='<a class="pull-left" style="padding: 0 3px 0" href="#"><img src="#" height="15" width="15" /></a>',c=$(b);return c.attr("href","/u/"+a.global_key),c.find("img").attr("src",g(a.avatar)),c}function e(){k={},h=99999999}function f(b){var c=$("#load_more");if(c.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...'),b+="?last_id="+h,"mine"===i){var d=router.current_user?router.current_user.global_key:"";b+="&global_key="+d}else b+="&sort="+i;$.ajax({url:API_DOMAIN+b,dataType:"json",xhrFields:{withCredentials:!0},success:function(b){b.data&&(a(b.data),h=b.data[b.data.length-1].id)},error:function(){alert("Failed to load pp")},complete:function(){c.text("更多泡泡")}})}function g(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}var h=99999999,i="time",j=null,k={};return{template_url:"/views/pp.html",context:".container",before_enter:function(a){$("#navigator").find("li:eq(1)").addClass("active");var b='<div class="row project_header"><div class="col-xs-4"><a href="#">最新</a></div><div class="col-xs-4"><a href="#">热门</a></div><div class="col-xs-4"><a href="#">我的</a></div></div>',c=$(b);c.find("div").eq(0).children("a").attr("href","/pp"),c.find("div").eq(1).children("a").attr("href","/pp/hot"),c.find("div").eq(2).children("a").attr("href","/pp/mine"),$("nav.main-navbar").after(c),"hot"===a?c.find("div").eq(1).addClass("active"):"mine"===a?c.find("div").eq(2).addClass("active"):c.find("div").eq(0).addClass("active")},on_enter:function(a){i="hot"===a?"hot":"mine"===a?"mine":"time";var b="mine"===i?"/api/tweet/user_public":"/api/tweet/public_tweets";f(b),$("#load_more").on("click",function(a){a.preventDefault(),f(b)})},on_exit:function(){$("#navigator").find("li").removeClass("active"),$(".project_header").remove(),e()}}}(),USER_ROUTE=function(){function a(a){var c="/api/user/key/"+a;$.ajax({url:API_DOMAIN+c,dataType:"json",xhrFields:{withCredentials:!0},success:function(c){c.data?(e=c.data,b(e)):(alert("Failed to load user"+a),$("#user-heading").html(""))},error:function(){alert("Failed to load user"+a),$("#user-heading").html("")}})}function b(a){var b=a||{},d='<h4 class="panel-title"><img src="#" height="25" width="25" /><a class="panel-title" data-toggle="collapse" href="#accordion" data-target="#user-details" aria-expanded="true" aria-controls="user-details"></a><a href="#" class="pull-right watched"></a><a href="#" class="pull-right followed"></a></h4>',e='<p><span class="description" ></span></p><table class="table"><tr class="join"><td>加入时间</td><td></td></tr><tr class="activity"><td>最后活动</td><td></td></tr><tr class="sufix"><td style="width: 30%;">个性后缀</td><td></td></tr></table>',f=$(d),g=$(e);if(f.find("img").attr("src",c(b.avatar)),f.find("a.panel-title").text(" "+b.name+" "),f.find("a.watched").attr("href","/u/"+b.global_key+"/followers").text(" "+b.fans_count+"粉丝 "),f.find("a.followed").attr("href","/u/"+b.global_key+"/friends").text(" "+b.follows_count+"关注 "),f.click(function(a){a.preventDefault();var b=$("#user-details");return b.collapse(b.hasClass("in")?"hide":"show"),!1}),g.find(".description").text(b.slogan),g.find("table .join td:eq(1)").text(moment(b.created_at).format("YYYY-MM-DD")),g.find("table .activity td:eq(1)").text(moment(b.last_activity_at).format("YYYY年MMMD号 ah点mm分")),g.find("table .sufix td:eq(1)").text(b.global_key),"undefined"!=typeof b.sex&&""!==b.sex){var h=0===b.sex?"男":"女";g.find("table tbody").append('<tr class="sex"><td>性别</td><td>'+h+"</td></tr>")}if("undefined"!=typeof b.job_str&&""!==b.job_str&&g.find("table tbody").append('<tr class="job"><td>工作</td><td>'+b.job_str+"</td></tr>"),"undefined"!=typeof b.location&&""!==b.location&&g.find("table tbody").append('<tr class="location"><td>地点</td><td>'+b.location+"</td></tr>"),"undefined"!=typeof b.tags_str&&""!==b.tags_str){for(var i=b.tags_str.split(","),j=[],k=0;k<i.length;k++){var l=i[k],m='<a href="/tags/search/'+l+'">'+l+"</a>";j.push(m)}g.find("table tbody").append('<tr class="tags"><td>标签</td><td>'+j.join()+"</td></tr>")}$("#user-details > .panel-body").html(g),$("#user-heading").html(f)}function c(a){return"/"===a.substr(0,1)&&(a=API_DOMAIN+a),a}var d,e;return{template_url:"/views/user_item.html",context:".container",before_enter:function(a){var b="/user/"+a,c='<div class="row project_header"><div class="col-xs-12"><a href="#"></a></div></div>',d=$(c);d.find("div").eq(0).children("a").attr("href",b),d.find("div").eq(0).children("a").text("个人中心"),$("nav.main-navbar").after(d)},on_enter:function(b){d=b,a(b)},on_exit:function(){$(".project_header").remove()}}}();!function(a,b,c,d,e,f,g,h,i){$(function(){FastClick.attach(document.body),moment.locale("zh"),$("button.navbar-toggle").click(function(){var a=$(this).data("target"),b=$(this).data("status");$(a).hasClass("collapsing")||("open"===b?($(a).collapse("hide"),$(this).find("img.up").hide(),$(this).find("img.down").show(),$(this).data("status","closed")):($(a).collapse("show"),$(this).find("img.up").show(),$(this).find("img.down").hide(),$(this).data("status","open")))
}),$("body.main").on("click touchmove",function(){var a=$("div.navbar-collapse"),b=$("button.navbar-toggle");a.hasClass("collapsing")||"open"!==b.data("status")||(a.collapse("hide"),b.find("img.up").hide(),b.find("img.down").show(),b.data("status","closed"))});var j=navigator.userAgent;j.match(/Android/i)?$("a.mobile-app-link").attr("href","https://coding.net/app/android"):j.match(/iPhone|iPad|iPod/i)&&$("a.mobile-app-link").attr("href","https://itunes.apple.com/app/id923676989"),window.router=new Routy.Router(null,"a",".main"),router.rootRegister(b),router.register("/login",a),router.register("/projects",b),router.register("/projects/:type",b),router.register("/u/:user/p/:project, /u/:user/p/:project/git",c),router.register("/u/:user/p/:project/tree, /u/:user/p/:project/tree/:commit/:path",d),router.register("/u/:user/p/:project/blob/:commit/:path",e),router.register("/u/:user/p/:project/pull",f),router.register("/u/:user/p/:project/topics",g),router.register("/pp",h),router.register("/pp/:type",h),router.register("/user/:user",i)})}(LOGIN_ROUTE,PROJECT_ROUTE,PROJECT_ITEM_ROUTE,PROJECT_TREE_ROUTE,PROJECT_BLOB_ROUTE,PROJECT_PULL_ROUTE,PROJECT_TOPICS_ROUTE,PP_ROUTE,USER_ROUTE);