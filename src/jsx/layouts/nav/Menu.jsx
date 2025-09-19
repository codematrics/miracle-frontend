export const MenuList = [
  {
    title: 'Dashboard',
    classsChange: 'mm-collapse',
    iconStyle: <i className="flaticon-381-networking" />,
    content: [
      {
        title: 'Dashboard',
        to: 'dashboard',
      },
    ],
  },
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
    ],
  },
  {
    title: 'Radiology',
    classsChange: 'mm-collapse',
    iconStyle: <i className="fa fa-x-ray" />,
    content: [
      {
        title: 'Workflow',
        to: 'radiology-workflow',
      },
    ],
  },
  {
    title: 'Master',
    classsChange: 'mm-collapse',
    iconStyle: <i className="fa fa-database" />,
    content: [
      {
        title: 'Doctors',
        to: 'doctors',
      },
      {
        title: 'Services',
        to: 'services',
      },
      {
        title: 'Parameters',
        to: 'parameters',
      },
      {
        title: 'Radiology Templates',
        to: 'radiology-templates',
      },
      {
        title: 'Beds',
        to: 'beds',
      },
    ],
  },
];
