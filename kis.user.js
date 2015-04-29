<!--
MINI_BEGIN
function KL()
{
    var SecureUrlMarker = "https://gc.kis.kaspersky-labs.com/1B74BD89-2A22-4B93-B451-1C9E1052A0EC/main.js";
    var InjectionId = "1B74BD89-2A22-4B93-B451-1C9E1052A0EC";

	  this.notifyProduct = function()
	  {
        if (!isHttps() || isScriptUrlAlreadyInserted())
        {
            console.debug("no init to inject");
            return;
        }
        
        var scriptUrl = createScriptUrl();
        injectScriptUrl(scriptUrl);
	  }

    function isHttps()
    {
        return "https:" == window.location.protocol;
    }

    function isScriptUrlAlreadyInserted()
    {
        return InjectionId in window;
    }

    function createScriptUrl()
    {
        return "{0}?nocache={1}&url={2}".
            replace("{0}", SecureUrlMarker).
            replace("{1}", Date.now()).
            replace("{2}", toBase64Url(location.toString()));
    }

    function injectScriptUrl(url)
    {
	      var scopeParent = document.head || createHeadNode(document);
	      var scriptNode = createScriptNode(url);
	      scopeParent.appendChild(scriptNode);
    }

    function toBase64Url(stringUcs2)
    {
        var stringUtf8 = unescape(encodeURIComponent(stringUcs2));
        var result = btoa(stringUtf8);
        result = result.replace(/\+/g, '-');
        result = result.replace(/\//g, '_');
        result = result.replace(/=+/, '');
        return result;
    }

  	function createScriptNode(src)
    {
		    var scriptNode = document.createElement("script");
        scriptNode.setAttribute("src", src);
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.setAttribute("charset", "UTF-8");
        return scriptNode;	
    }	

    function createHeadNode(doc)
    {
        var root = doc.firstChild;
        var headNode = doc.createElement("head");
        root.appendChild(headNode);

        return headNode;
    }
}

var __kl = new KL();
__kl.notifyProduct();

MINI_END
-->

<body>
 <script type="text/javascript" src="https://gc.kis.kaspersky-labs.com/1B74BD89-2A22-4B93-B451-1C9E1052A0EC/main.js"></script>

 <script type="text/javascript">
   function proxy(cmd, args) {
     console.debug("proxy(), cmd =", cmd, ", args =", args);
     parent.postMessage({
       type : "kl-proxy",
       cmd  : cmd,
       args : args
     }, "*");
   }

   window.plugin = {
       toolbarButton : {
           setDefaultState : function(state) {
               proxy("api.toolbarButton.setDefaultState", state);
           },
           setStateForTab : function(tabId, state) {
               proxy("api.toolbarButton.setStateForTab", [tabId, state]);
           }
       },
       getDocumentType : function() {
           console.debug("no-proxy: getDocumentType()");
           return 1;
       },
       onConnect : function(settings) {
           proxy("api.onConnect", settings);
       },
       onDisconnect : function() {
           proxy("api.onDisconnect", true);
       }
   }; // window.plugin
   
   window.addEventListener("message", function (ev) {
      if (!("main/kl-proxy" == ev.data.type && "ready" == ev.data.cmd)) {
        console.debug("-> unsupported");
        return;
      }

      window.dispatchEvent(new CustomEvent(ev.data.args));
   }, false);

   proxy(".frame-ready", null);
 </script>
</body>
