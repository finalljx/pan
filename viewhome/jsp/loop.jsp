<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<%@ page language="java" import="java.util.*"%>
<%@ page language="java" import="cc.movein.mum.entity.Person"%>
<%@ page language="java" import="cc.movein.mdm.entity.Device"%>
<%@ page language="java" import="org.apache.commons.logging.Log"%>
<%@ page language="java" import="cc.movein.mdm.service.PushService"%>
<%@ page language="java" import="cc.movein.mum.service.UserService"%>
<%@ page language="java" import="cc.movein.mda.system.control.Query"%>
<%@ page language="java" import="cc.movein.mdm.service.DeviceService"%>
<%@ page language="java" import="cc.movein.mda.kernel.context.Context"%>
<%@ page language="java" import="org.apache.commons.logging.LogFactory"%>
<%@ page language="java" import="cc.movein.mda.system.control.entity.UserStore"%>
<%@ page language="java" import="cc.movein.mda.system.control.service.TokenService"%>
<% 
	Log log = LogFactory.getLog("pusher");

	Query q = Query.newInstance();

	UserService userService = Context.getService(UserService.class);
	List<Person> persons = userService.listallusers();
	out.println("start");
	for(int i=0; null !=persons && i<persons.size(); i++){
		Person p = persons.get(i);
		String userid = p.getUserid().toLowerCase();
		String password=p.getPassword();
		
		TokenService tokenService = Context.getService(TokenService.class);
		UserStore store = tokenService.getUserStoreByUserId(userid);
		log.info("数据轮询:当前用户="+userid+",UserStore="+store);
		if(null != store){
			q.setUserStore(store);
			q.setMethod("post");
			q.setEncoding("utf-8");
			q.getNewMessage().setXmlContent("yes^~^app|1|vwTaskUnDoneForMobile|taskByDateDownDoneView^~^msg|1|vwMsgUnRdForMobile|msgByDateDownRdView");
			q.setUrl("http://oadev.dawning.com.cn/Produce/GeneralMessage.nsf/GetAllMsgInfoAgent?openagent&login");
			Query t = q.process(Boolean.TRUE);
			String count = t.valueOf("//app/@num1", "0");
			
			DeviceService ds = Context.getService(DeviceService.class);
			Device device = ds.findByUserId(userid);
			if(null != device){
				PushService ps = Context.getService(PushService.class);
				ps.message(count, "您有" + count + "条代办需要处理", device);
				log.info("数据轮询:"+userid+"有" + count + "条代办");
			}else{
				log.info("数据轮询:此用户无设备");
			}
			out.println(userid+"代办事宜为:"+count);
		}
	}
	
%>