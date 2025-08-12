// import { SVGICON } from "../../constant/theme";

export const MenuList = [
   
    //Dashboard
    {
        title: 'Dashboard',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="flaticon-381-networking" />,
        content: [
            {
                title: 'Dashboard',
                to: 'dashboard',					
            },
            // {
            //     title: 'Doctors',
            //     to: 'doctor',                
            // },
            // {
            //     title: 'Doctor Details',
            //     to: 'doctor-details',                
            // },
            // {
            //     title: 'Reviews',
            //     to: 'reviews',                
            // },            
            // {
            //     title: 'Task',
            //     to: 'task',                
            // },
        ],
    }, 
    // Reception
    {
        title: 'Reception',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="flaticon-381-bookmark-1" />,
        content: [
            {
                title: 'Visits',
                to: 'patient',                
            },
            {
                title: 'OPD Billing',
                to: 'opd-bill',                
            },
            {
                title: 'Appointment',
                to: 'opd-appointment',                
            },
            // {
            //     title: 'Doctors',
            //     to: 'doctor',                
            // },
            // {
            //     title: 'Doctor Details',
            //     to: 'doctor-details',                
            // },
            // {
            //     title: 'Reviews',
            //     to: 'reviews',                
            // },            
            // {
            //     title: 'Task',
            //     to: 'task',                
            // },
        ],
    }, 
    {
        title: 'Pathology',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="fa fa-receipt" />,
        content: [
            {
                title: 'Work Flow',
                to: 'lab-workflow',           
            },
            {
                title: 'Result Entry',
                to: 'lab-result-entry',                
            },
            {
                title: 'Authorization',
                to: 'lab-authorization',                
            },
        ]
    },
	//Widget
    // {   
    //     title:'Pathology',
    //     //classsChange: 'mm-collapse',
    //     iconStyle: <i className="fa fa-receipt" />,
    //     to: 'opd-bill',
    // },
    //Pages
    {
        title:'Pages',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-layer-1" />,
        content : [
            {
                title:'Error',
                hasMenu : true,
                content : [
                    {
                        title: 'Error 400',
                        to : 'page-error-400',
                    },
                    {
                        title: 'Error 403',
                        to : 'page-error-403',
                    },
                    {
                        title: 'Error 404',
                        to : 'page-error-404',
                    },
                    {
                        title: 'Error 500',
                        to : 'page-error-500',
                    },
                    {
                        title: 'Error 503',
                        to : 'page-error-503',
                    },
                ],
            },
            {
                title:'Lock Screen',
                to: 'page-lock-screen',
            },

        ]
    },
    
]