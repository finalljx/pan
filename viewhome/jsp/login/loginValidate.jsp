<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    <%@ page language="java" import="cc.movein.mda.system.control.Query"%>
<%@ page language="java" import="org.json.*"%>

<%@ page language="java" import="org.dom4j.io.SAXReader"%>

<%@ page language="java" import="org.dom4j.Document"%>
<%@ page language="java" import="org.dom4j.DocumentException"%>
<%@ page language="java" import="org.dom4j.Element"%>
<%@ page language="java" import="org.dom4j.Node"%>
<%@ page language="java" import="org.dom4j.DocumentHelper"%>


				<%
				JSONObject json=new JSONObject();			
				Query q = Query.getInstance(request);
			
				String responseXml = q.getContent();
				System.out.println(responseXml);
				Document   doc = DocumentHelper.parseText(responseXml);
				try{
					Element tokenNode=(Element) doc.selectSingleNode("//param[@name='X-Auth-Token']");
					String token="";
					if(tokenNode!=null){
						token=tokenNode.attribute("value").getText();
					}
					
					Element containerNode =(Element) doc.selectSingleNode("//param[@name='X-Container-Name']");
					String containerName="";
					if(containerNode!=null){
						containerName=containerNode.attribute("value").getText();
					}
					Node loginCodeNode = doc.selectSingleNode("//statuscode");
					String loginCode="";
					if(loginCodeNode!=null){
						loginCode=loginCodeNode.getStringValue();
					}
					System.out.println("loginCode="+loginCode);
					if (loginCode.equals("200")){
						json.put("success", true);
						json.put("token",token);
						json.put("containerName",containerName);
						json.put("data-authorize","succeed");

					}
					else if(loginCode.equals("401")){
						json.put("success", false);
						json.put("msg","用户名或密码错误");

					}
					else{				
								
						json.put("success", false);
						json.put("msg","登陆异常11123,请联系管理员。");
						out.clear();
						out.print(json);

					}
						
						
					
				}catch(Exception e){
					e.printStackTrace();
							
					json.put("success", false);
					json.put("msg","登陆异常,请联系管理员。");
					out.clear();
					out.print(json);
				}

			
				out.clear();
				out.print(json);
				System.out.println(json);
				
				%>
				