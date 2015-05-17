<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    <%@ page language="java" import="cc.movein.mda.system.control.Query"%>
<%@ page language="java" import="org.json.*"%>
<%@ page language="java" import="org.dom4j.Document"%>
<%@ page language="java" import="org.dom4j.DocumentException"%>
<%@ page language="java" import="org.dom4j.Element"%>
<%@ page language="java" import="org.dom4j.Node"%>
<%@ page language="java" import="org.dom4j.DocumentHelper"%>
<%@ page language="java" import="java.util.List"%>
<%@ page language="java" import="java.util.Iterator"%>
<%@ page language="java" import="org.apache.commons.lang.StringEscapeUtils"%>

				<%
				JSONArray taskArray=new JSONArray();
				JSONObject taskJson=new JSONObject();	
				Query q = Query.getInstance(request);
				String responseXml = q.getContent();
				System.out.println(responseXml);
				Document   doc = DocumentHelper.parseText(responseXml);
				
				String todsNumber = "0";
				boolean needLogin = false;
				Node loginNode=doc.selectSingleNode("//form/@action");
				String  statuscode=doc.selectSingleNode("//statuscode").getStringValue();
				if ((loginNode!=null && loginNode.getStringValue().contains("names.nsf")) || statuscode.equals("401")) {
					needLogin=true;
				} else {
				
				
				 todsNumber=doc.selectSingleNode("//viewentries/@toplevelentries").getStringValue();
				List todosList=doc.selectNodes("//viewentry");
				for(Iterator i=todosList.iterator();i.hasNext();){
					Element todoInfo=(Element)i.next();
					JSONObject json=new JSONObject();
					Node idate=(Node)todoInfo.selectNodes("./entrydata[1]").get(0);
					Node title=todoInfo.selectSingleNode("./entrydata[2]");			//标题
					
					//服务器名称
					Node serverName=todoInfo.selectSingleNode("./entrydata[3]");
					//数据库路径
					Node dbpath=todoInfo.selectSingleNode("./entrydata[4]");	
					//form 名称
					Node formName=todoInfo.selectSingleNode("./entrydata[5]");	
					/*
						cdata q.getContent() 前面的<被转义为&lg;,反解义
					*/
					String idateString=DocumentHelper.parseText(StringEscapeUtils.unescapeXml(idate.asXML())).getRootElement().getText();
					String titleString=DocumentHelper.parseText(StringEscapeUtils.unescapeXml(title.asXML())).getRootElement().getText();
							
					String serverNameString=DocumentHelper.parseText(StringEscapeUtils.unescapeXml(serverName.asXML())).getRootElement().getText();
					String dbpathString=DocumentHelper.parseText(StringEscapeUtils.unescapeXml(dbpath.asXML())).getRootElement().getText();

					String unid=todoInfo.attributeValue("unid");
					System.out.println("dbpathString="+dbpathString);
					String href="";
					json.put("title",titleString);
					json.put("date",idateString);
					json.put("unid",unid);
					
					json.put("href",unid);
					taskArray.put(json);
					
				}
				}
				taskJson.put("taskCount", todsNumber);		
				taskJson.put("tasklist",taskArray);
				taskJson.put("needLogin", needLogin);
			
				out.clear();

				out.print(taskJson);

				System.out.println(taskJson);
				
				%>
				