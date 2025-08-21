import React, { Fragment } from 'react';

import PageTitle from '../../layouts/PageTitle';
import BasicDatatable from './BasicDatatable';
import FeesCollection from './FeesCollection';
import PatientTable from './PatientTable';
import ProfileDatatable from './ProfileDatatable';
import SimpleDataTable from './SimpleDataTable';

const DataTable = () => {
  return (
    <Fragment>
      <PageTitle activeMenu="Datatable" motherMenu="Table" pageContent="Datatable" />
      <div className="row">
        <BasicDatatable />
        <SimpleDataTable />
        <ProfileDatatable />
        <FeesCollection />
        <PatientTable />
      </div>
    </Fragment>
  );
};

export default DataTable;
