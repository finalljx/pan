/**
 * User: gaoquansheng
 * Date: 2014-11-01
 * 提供各个功能模块的数据接口
 */
angular.module('hori').service('dataService', ['configService', 'deviceService', 'global', function(configService, deviceService, global) {

    /*
     * @description: 获取企业新闻列表
     * @param model 查询模型
     */
    this.getNews = function(model) {
        var url = '',
            start = 1,
            count = 20;
        if (angular.isObject(model)) {
            if (model.start) {
                start = model.start;
            }

            if (model.count) {
                count = model.count;
            }
        }

        try {
            url = configService.appServerHost + 'view/oa/newslist/Application/DigiFlowInfoPublish.nsf/InfoByDateView_2?readviewentries?login';
            url = url + '&start=' + start + '&count=' + count;
        } catch (e) {

        }

        return deviceService.ajax({
            'type': 'post',
            'url': url
        });
    };

    /*
     * @description: 获取企业新闻详细信息
     * @param model 查询模型
     */
    this.getNewsDetail = function(model) {
        return {
            title: '一体化应用 打造企业新办公自动化平台',
            source: '2013-06-06  admin  研发部',
            dept: '',
            author: '',
            date: '2014-11-02',
            content: '<p style="white-space: normal; word-spacing: 0px; text-transform: none; color: rgb(85,85,85); font: 12px/19px 微软雅黑; letter-spacing: normal; text-indent: 0px; -webkit-text-stroke-width: 0px">身处当前日趋激烈的商业竞争，再加上信息技术的迅猛发展，企业不再满足于独立、零散的办公自动化和计算机应用，而需要综合、集成化的信息化解决方案。针对企业不断涌现的办公自动化方面的需求，鼎捷软件于2013年4月19日下午在深圳华强广场酒店举办了一场主题为“易飞ERP与OA办公自动化协同应用”的信息化整体解决方案系列活动，以期为深圳地区的易飞ERP老老客们带来精彩的信息技术方案与宝贵的管理实践经验。</p><p style="white-space: normal; word-spacing: 0px; text-transform: none; color: rgb(85,85,85); font: 12px/19px 微软雅黑; letter-spacing: normal; text-indent: 0px; -webkit-text-stroke-width: 0px">　　活动伊始，来自鼎捷软件的OA产品专家王鑫为各位与会来宾讲解了易飞ERP与OA协同应用管理的价值及意义。王顾问从企业的业务战略与信息化战略出发，分为行政办公与协同办公，OA与ERP一体化整合，OA实现企业协同办公，OA移动办公，OA系统总体建设目标等六部分，详细介绍析了OA办公自动化系统在有效整合企业信息系统资源，协调和推进企业日常工作，加强管理，实现高效的协同管理、灵活的业务流程整合、有效的知识管理等方面，带给企业的价值所在。</p><p style="white-space: normal; word-spacing: 0px; text-transform: none; color: rgb(85,85,85); font: 12px/19px 微软雅黑; letter-spacing: normal; text-indent: 0px; -webkit-text-stroke-width: 0px">　　之后，王鑫顾问又与诸多参会嘉宾分享了晶石电器在应用鼎捷易飞ERP与OA一体化解决方案后的宝贵经验：晶石电器通过运用OA办公自动化系统，帮忙企业解决了表单繁多、信息重复、表单审批过程不透明、审批周期长、异常情况（有人出差请假、部门重组）而导致流程耽搁滞后等问题，实现了真正意义上的办公自动化。通过优秀案例的分享，嘉宾们对易飞ERP与OA系统的一体化应用有了更直观和清晰的认识。他们纷纷表示，信息化一体化解决方案对于提升企业管理层的决策能力意义重大。</p><p style="white-space: normal; word-spacing: 0px; text-transform: none; color: rgb(85,85,85); text-align: left; font: 12px/19px 微软雅黑; letter-spacing: normal; text-indent: 0px; -webkit-text-stroke-width: 0px">　　作为企业信息化的重要合作伙伴，鼎捷软件始终致力于帮助更多的企业，通过易飞ERP与OA办公自动化集成应用一体化协同解决方案，完成数字经济转型，实现信息化腾飞。鼎捷软件亦秉承着“与客户共创数字价值”的理念，以期让更多企业的运营管理提升受益于信息化的应用价值。<br>&nbsp;</p><p style="white-space: normal; word-spacing: 0px; text-transform: none; color: rgb(85,85,85); text-align: center; font: 12px/19px 微软雅黑; letter-spacing: normal; text-indent: 0px; -webkit-text-stroke-width: 0px"><img alt="" src="http://www.digiwin.com.cn/digiwinadmin/Docs/Cms/Image/%7B945ca55b-72db-409f-b9cd-37f42855d06d%7D.png"></p>',
            files: [{
                text: '附件一'
            }, {
                text: '附件二'
            }]
        };
    };

    /*
     * @description: 获取待办事宜
     * @param model 查询模型
     */
    this.getTodos = function(model) {
        var url = '',
            start = 1,
            count = 20,
            oaMsgServer = configService.oaMsgServer,
            itcode = global.getItcode();

        if (angular.isObject(model)) {
            if (model.start) {
                start = model.start;
            }

            if (model.count) {
                count = model.count;
            }
        }

        try {
            url = configService.appServerHost + 'view/oamobile/todosmobile/Produce/DigiFlowMobile.nsf/agGetMsgViewData?openagent&login&server=' + oaMsgServer + '&dbpath=DFMessage/dfmsg_' + itcode + '.nsf&view=vwTaskUnDoneForMobile&thclass=';
            url = url + '&start=' + start + '&count=' + count+"&page=1";
        } catch (e) {

        }

        return deviceService.ajax({
            'type': 'post',
            'url': url
        });
    };

    /*
     * @description: 获取未读消息
     * @param model 查询模型
     */
    this.getUnreads = function(model) {
        var url = '',
            start = 1,
            count = 20,
            oaMsgServer = configService.oaMsgServer,
            itcode = global.getItcode();

        if (angular.isObject(model)) {
            if (model.start) {
                start = model.start;
            }

            if (model.count) {
                count = model.count;
            }
        }

        try {
            url = configService.appServerHost + 'view/oamobile/messagelist/Produce/DigiFlowMobile.nsf/agGetMsgViewData?openagent&login&server=' + oaMsgServer + '&dbpath=DFMessage/dfmsg_' + itcode + '.nsf&view=vwMsgUnRdForMobile&thclass=';
            url = url + '&start=' + start + '&count=' + count+"&page=1";
        } catch (e) {

        }

        return deviceService.ajax({
            'type': 'post',
            'url': url
        });
    };

    /*
     * @description: 获取未读消息条数
     */
    this.getUnreadsNum = function() {
        var url = '';

        try {
            url = configService.appServerHost + 'view/oamobile/todosnum/Produce/GeneralMessage.nsf/GetAllMsgInfoAgent_sugon?openagent';
            url = url + "&random=" + (new Date().getTime());
        } catch (e) {

        }

        return deviceService.ajax({
            'type': 'post',
            'url': url
        });
    };

    /*
     * @description: 获取待办事宜
     * @param model 查询模型
     */
    this.getContacts = function(model) {
        var url = '',
            queryStr = '',
            oaServerName = configService.oaServerName;

        if (angular.isObject(model)) {
            queryStr = model.queryStr;
        }

        try {
            url = configService.appServerHost + 'view/oa/phonenumberrequest/Produce/WeboaConfig.nsf/telSearchForm?openform&svrName=' + oaServerName + '&queryStr=' + queryStr + '&dbFile=Produce/DigiFlowOrgPsnMng.nsf&showField=UserDeptPhone';
        } catch (e) {

        }

        return deviceService.ajax({
            'type': 'post',
            'url': url
        });
    };
    /*
     * @description: 获取表单信息
     * @param model 查询模型
     */
    this.getFormInfo = function() {
        return [{
            type: 'hidden',
            label: ''
        }, {
            type: 'text',
            value: '11',
            label: '',
            disabled: false,
        }, {
            type: 'select',
            disabled: false,
            label: '',
            options: [{
                value: '',
                text: ''
            }]
        }, {
            type: 'radio',
            label: '',
            disabled: false,
            options: [{
                value: '',
                text: ''
            }]
        }, {
            type: 'checkbox',
            disabled: false,
            label: '',
            options: [{
                value: '',
                text: ''
            }]
        }];
    };


    this.getNotices = function() {
        return [{
                title: '通知',
                date: '10-13'
            },

            {
                title: '通知',
                date: '10-13'
            },

            {
                title: '通知',
                date: '10-13'
            },

            {
                title: '通知',
                date: '10-13'
            }
        ];
    };

    this.getImagesNews = function() {
        return [{
                title: '图片新闻',
                date: '10-13',
                url: 'images/slider/image1.png'
            },

            {
                title: '图片新闻',
                date: '10-13',
                url: 'images/slider/image2.png'
            },

            {
                title: '图片新闻',
                date: '10-13',
                url: 'images/slider/image3.png'
            },

            {
                title: '图片新闻',
                date: '10-13',
                url: 'images/slider/image4.png'
            }
        ];
    };
}]);
