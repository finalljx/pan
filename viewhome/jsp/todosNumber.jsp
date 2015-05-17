<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
    <%@ page language="java" import="cc.movein.mda.system.control.Query"%>
<%@ page language="java" import="org.json.*"%>

<%@ page language="java" import="org.dom4j.Document"%>
<%@ page language="java" import="org.dom4j.DocumentException"%>
<%@ page language="java" import="org.dom4j.Element"%>
<%@ page language="java" import="org.dom4j.Node"%>
<%@ page language="java" import="org.dom4j.DocumentHelper"%>
				<%
				try{
				JSONObject json=new JSONObject();			
				Query q = Query.getInstance(request);
				String responseXml = q.getContent();
				System.out.println(responseXml);
				Document   doc = DocumentHelper.parseText(responseXml);
				String todsNumber=doc.selectSingleNode("//app/@num1").getStringValue();
			
			
				json.put("number", todsNumber);		
				json.put("exception","");
			
				out.clear();
				out.print(json);
				System.out.println(json);
				}catch(Exception e){
					JSONObject json=new JSONObject();
					json.put("exception",e.getMessage());
					out.clear();
					out.println(json);
				}
				%>
				