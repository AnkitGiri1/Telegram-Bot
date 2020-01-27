var telurl="https://api.telegram.org/bot1065567155:AAEcAahHBq4f_IuUuDnBPt3JpowwOU86xKo/";  //url+apikey
var webAppurl ="https://script.google.com/macros/s/AKfycbzE6A1QKdkmk6tRwu6n4IC2_DzR5d-9xz_RoD4aY6glWYuIyc0g/exec";  //webappurl

function doGet(e)
{
  var url="https://api.telegram.org/bot1065567155:AAEcAahHBq4f_IuUuDnBPt3JpowwOU86xKo/getme";
  var response=UrlFetchApp.fetch(url);
  console.log(response);
  Logger.log(response);
  return HtmlService.createHtmlOutput(response.getContentText());
}
function setWebHook()
{
  var url=telurl+ "setWebhook?url=" + webAppurl ;
  var response=UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}
//---------------------------------------------------------------------MAIN -------------------------------------------------------
function doPost(e) 
{
  var data = JSON.parse(e.postData.contents);
    if(data.callback_query) 
  {
    callback(e);
    return;
  }
  var id= data.message.chat.id;
  var command = data.message.text ;
  
  var from = data.message.from.id ;
// commands - /filelist , /add , /gewn_link , /delete    
  if( command.substr(0,4)=="/add" )
  {
    var magnet = command.substr(5);
    if( magnet == "" )
    {
      var url=telurl +  "sendMessage?chat_id=" + id + "&text=Please enter magnet";
      UrlFetchApp.fetch(url);
      return;
    }
    add(magnet,id);
  }
  else if( command.substr(0,9)=="/filelist" )
  {
    file_list(id) ;
  }
  else
  {
    magnet = data.message.text ;
    add(magnet,id);
  }
}
//------------------------------------------------------------ADD FILE----------------------------------------------------------------------------------//
function add(magnet,id)
{
  var response = UrlFetchApp.fetch( "https://bytebx.com/login" );
  var cookie = response.getAllHeaders()['Set-Cookie'];
  var message=response.getContentText() ;
  var st=message.indexOf("value=")+7;
  var en=message.indexOf(">",st)-1;
  var cv=message.substring(st,en);
  st=message.indexOf("value=",st)+7;
  en=message.indexOf(">",st)-1;
  var cn=message.substring(st,en);
  cookie=cookie.substring(0,cookie.indexOf(';'));
  Logger.log( cookie );
  var header = {
    'accept' : '*/*' ,
    'accept-language' : 'en-US,en;q=0.9' ,
    'content-type' : 'application/x-www-form-urlencoded; charset=UTF-8' ,
    'cookie' : cookie ,
    'dnt' : '1' ,
    'origin' : 'https://bytebx.com' ,
    'referer' : 'https://bytebx.com/login' ,
    'sec-fetch-mode' : 'cors' ,
    'sec-fetch-site' : 'same-origin' ,
    'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36' ,
    'x-requested-with' : 'XMLHttpRequest'
  };
  var formdata = {
    'cv' : cv ,
    'cn' : cn ,
    'login' : '' ,  // enter login bytebx
    'password' : ''  // enter password
  };
  var options = {
    'method' : 'post' ,
    'headers' : header ,
    'payload' : formdata
  };
  var burl = "https://bytebx.com/login";
  var response = UrlFetchApp.fetch( burl , options ); 
  Logger.log(response);
  
  var options = {
    'method' : 'get' ,
    'headers' : header ,
    'payload' : formdata
  };
  var response = UrlFetchApp.fetch( "https://bytebx.com/storage" ,options );
  var formdata = { 
    'url': magnet,
    'file': undefined
  }
  var options = {
    'method' : 'post' ,
    'headers' : header ,
    'payload' : formdata
  }; 
  try
  {
    var response = UrlFetchApp.fetch( "https://bytebx.com/add_files" ,options );
  }
  catch (e){};
  var url=telurl +  "sendMessage?chat_id=" + id + "&text=" + "%20%20%20%20%20%20file ADDED " + "%0A /filelist to see all FILES ";
  UrlFetchApp.fetch(url);
}
//--------------------------------------------------------------------GET FILE LIST---------------------------------------------------------------------------
function file_list(id)
{

  var test=0;
  var response = UrlFetchApp.fetch( "https://bytebx.com/login" );
  var cookie = response.getAllHeaders()['Set-Cookie'];
  var message=response.getContentText() ;
  var st=message.indexOf("value=")+7;
  var en=message.indexOf(">",st)-1;
  var cv=message.substring(st,en);
  st=message.indexOf("value=",st)+7;
  en=message.indexOf(">",st)-1;
  var cn=message.substring(st,en);
  cookie=cookie.substring(0,cookie.indexOf(';'));
  var header = {
    'accept' : '*/*' ,
    'accept-language' : 'en-US,en;q=0.9' ,
    'content-type' : 'application/x-www-form-urlencoded; charset=UTF-8' ,
    'cookie' : cookie ,
    'dnt' : '1' ,
    'origin' : 'https://bytebx.com' ,
    'referer' : 'https://bytebx.com/login' ,
    'sec-fetch-mode' : 'cors' ,
    'sec-fetch-site' : 'same-origin' ,
    'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36' ,
    'x-requested-with' : 'XMLHttpRequest'
  };
  var formdata = {
    'cv' : cv ,
    'cn' : cn ,
    'login' : '' ,  // enter login bytebx
    'password' : ''  // enter password
  };
  var options = {
    'method' : 'post' ,
    'headers' : header ,
    'payload' : formdata
  };
  var burl = "https://bytebx.com/login";
  var response = UrlFetchApp.fetch( burl , options );   
  
  var options = {
    'method' : 'get' ,
    'headers' : header ,
//    'muteHttpExceptions' : true ,
  };
  var st=-1;
  var p=0;
  var server="";
  var response = UrlFetchApp.fetch( "https://bytebx.com/storage" ,options ); 
  var re = response.getContentText() ;
Logger.log(re.length);
  do
  {
    st=re.indexOf('\/torrent\/',st+1)+9;
    var end=re.indexOf('"',st);
    var hash=re.substring(st,end);
Logger.log(st);    
Logger.log(hash);
    
    //{"active_time":8,"dr":47995,"error":"","has_metadata":true,"hash":"dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c",
    //"name":"Big Buck Bunny","peers":5,"progress":0,"size":"276445467","state":"downloading"}
    if ( st == 8 ) break;;
    
    try
    {
        var options = {
          'method' : 'get' ,
          'headers' : header ,
//          'muteHttpExceptions' : true ,
  };
      var response = UrlFetchApp.fetch( "https://"+server+"bytebx.com/gate/status?hash="+hash ,options );         
       Logger.log(response)
      try
      {
        var file=JSON.parse(response);   
        Logger.log(file);
        p++;
        message ="Title: " + file.name +"\n" + "Size: " + Math.floor(file.size/(1024*1024)) +"MB"+" Progress: " + JSON.stringify(file) ;
      }
      catch(err)
      {
        var file=response;   
        Logger.log(file);
        p++;
        message ="Title: " + file.name +"\n" + "Size: " + Math.floor(file.size/(1024*1024)) +"MB" + 
          "Progress: " + file.progress ;        
      }
      var payload = {
    'chat_id' : id ,
    "text": message,
    "reply_markup": {
      "inline_keyboard": [[
        {
          "text": "Get Link",
          "callback_data": "gl_"+file.hash             
        }, 
        {
          "text": "Delete",
          "callback_data": "del_"+file.hash             
        }]]
    }    
  }
  var options = {
    'method' : 'post' , 
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload) ,
    'muteHttpExceptions' : true , 
  }
  var url = telurl + "sendMessage" ;
  if(test==0)var response = UrlFetchApp.fetch( url , options );
    }
    catch(er)
    {
     console.log(er.tostring); 
    }
  }
  while (st != 8);
  if ( p==0 )
  {
     var url=telurl +  "sendMessage?chat_id=" + id + "&text=NO files found.";
    UrlFetchApp.fetch(url);
  }
}
//---------------------------------------------------------------DELETE FILE-----------------------------------------------------------
function del_file( id , hash , filename ,data )
{
  var response = UrlFetchApp.fetch( "https://bytebx.com/login" );
  var cookie = response.getAllHeaders()['Set-Cookie'];
  var message=response.getContentText() ;
  var st=message.indexOf("value=")+7;
  var en=message.indexOf(">",st)-1;
  var cv=message.substring(st,en);
  st=message.indexOf("value=",st)+7;
  en=message.indexOf(">",st)-1;
  var cn=message.substring(st,en);
  cookie=cookie.substring(0,cookie.indexOf(';'));
  Logger.log( cookie );
  var header = {
    'accept' : '*/*' ,
    'accept-language' : 'en-US,en;q=0.9' ,
    'content-type' : 'application/x-www-form-urlencoded; charset=UTF-8' ,
    'cookie' : cookie ,
    'dnt' : '1' ,
    'origin' : 'https://bytebx.com' ,
    'referer' : 'https://bytebx.com/login' ,
    'sec-fetch-mode' : 'cors' ,
    'sec-fetch-site' : 'same-origin' ,
    'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36' ,
    'x-requested-with' : 'XMLHttpRequest'
  };
  var formdata = {
    'cv' : cv ,
    'cn' : cn ,
    'login' : '' ,  // enter login bytebx
    'password' : ''  // enter password
  };
  var options = {
    'method' : 'post' ,
    'headers' : header ,
    'payload' : formdata
  };
  var burl = "https://bytebx.com/login";
  var response = UrlFetchApp.fetch( burl , options ); 
  Logger.log(response);
  
  var options = {
    'method' : 'get' ,
    'headers' : header ,
  };
  var burl = "https://bytebx.com/remove/"+hash ;
  var response = UrlFetchApp.fetch( burl , options ); 
  delete_message( id ,hash , filename , data );
}
//--------------------------------------------------------GENERATE DOWNLOAD LINK-----------------------------------------------------------------------
function gen_link(id , hash , filename , data )
{
  var response = UrlFetchApp.fetch( "https://bytebx.com/login" );
  var cookie = response.getAllHeaders()['Set-Cookie'];
  var message=response.getContentText() ;
  var st=message.indexOf("value=")+7;
  var en=message.indexOf(">",st)-1;
  var cv=message.substring(st,en);
  st=message.indexOf("value=",st)+7;
  en=message.indexOf(">",st)-1;
  var cn=message.substring(st,en);
  cookie=cookie.substring(0,cookie.indexOf(';'));
  Logger.log( cookie );
  var header = {
    'accept' : '*/*' ,
    'accept-language' : 'en-US,en;q=0.9' ,
    'content-type' : 'application/x-www-form-urlencoded; charset=UTF-8' ,
    'cookie' : cookie ,
    'dnt' : '1' ,
    'origin' : 'https://bytebx.com' ,
    'referer' : 'https://bytebx.com/login' ,
    'sec-fetch-mode' : 'cors' ,
    'sec-fetch-site' : 'same-origin' ,
    'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36' ,
    'x-requested-with' : 'XMLHttpRequest'
  };
  var formdata = {
    'cv' : cv ,
    'cn' : cn ,
    'login' : '' ,  // enter login bytebx
    'password' : ''  // enter password
  };
  var options = {
    'method' : 'post' ,
    'headers' : header ,
    'payload' : formdata
  };
  var burl = "https://bytebx.com/login";
  var response = UrlFetchApp.fetch( burl , options ); 
  Logger.log(response);
  var header = {
    'accept' : '*/*' ,
    'accept-language' : 'en-US,en;q=0.9' ,
    'content-type' : 'application/x-www-form-urlencoded; charset=UTF-8' ,
    'cookie' : cookie ,
    'dnt' : '1' ,
    'origin' : 'https://bytebx.com' ,
    'referer' : 'https://bytebx.com/refer' ,
    'sec-fetch-mode' : 'cors' ,
    'sec-fetch-site' : 'same-origin' ,
    'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36' ,
    'x-requested-with' : 'XMLHttpRequest'
  };
  var options = {
    'method' : 'get' ,
    'headers' : header ,
  };
  var response = UrlFetchApp.fetch( "https://bytebx.com/torrent/"+hash ,options ); 
   
  var response = UrlFetchApp.fetch( "https://bytebx.com/zip/"+hash ,options ); 
   
  var linknstatus=JSON.parse(response);
  Logger.log(linknstatus.link);
   
  var link = linknstatus.link ;
  if(link.indexOf('//bytebx.com')!=-1)link = link.replace("bytebx.com","rb348.bytebx.com");

  edit_message( id, link ,filename , data , hash );
}
//-------------------------------------------------Delete Message----------------------------------------------
function delete_message( id , message ,filename , data )
{
  var m_id= data.callback_query.message.message_id;
  var payload = {
    'chat_id' : id ,
    "message_id" : m_id ,
  }
  var options = {
    'method' : 'post' , 
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload) ,
    'muteHttpExceptions' : true , 
  }
  var url = telurl + "deleteMessage" ;
  Logger.log(JSON.stringify(payload));
  var response = UrlFetchApp.fetch( url , options );
}

//-------------------------------------------------Edit Message ----------------------------------------------------
function edit_message( id , message ,filename , data , hash )
{
 message=message.split(' ').join('%20');
  var m_id= data.callback_query.message.message_id; 
  var payload = {
    'chat_id' : id ,
    "text": filename  ,
    "message_id" : m_id ,
    "reply_markup": {
      "inline_keyboard": [
        [{
          "text": "Click to Download",
          "url": message             
        }],
        [{
          "text": "Delete",
          "callback_data": "del_"+hash              
        }]
                         ]
    }    
  }
  var options = {
    'method' : 'post' , 
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload) ,
    'muteHttpExceptions' : true , 
  }
  var url = telurl + "editMessageText" ;
  Logger.log(JSON.stringify(payload));
  var response = UrlFetchApp.fetch( url , options );
}
//----------------------------------------call-backs------------------------------------------------
function callback(e)
{
  var data = JSON.parse(e.postData.contents);
  var id= data.callback_query.message.chat.id;
  var filename = data.callback_query.message.text ;
  if ( data.callback_query.data.substr(0,2) == "gl" )
  {
    gen_link( id,data.callback_query.data.substr(3),filename , data);
  }
  else if ( data.callback_query.data.substr(0,3) == "del" )
  {
    del_file( id,data.callback_query.data.substr(4),filename , data);
  }
}