import React from 'react';
// import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';

import PageTitle from '../../../layouts/PageTitle';
import BarChartNoPadding from './BarChartNoPadding';
import LegendEffectOpacity from './LegendEffectOpacity';
import NagetivePositive from './PositiveNagative2';
import TinyLineChart from './TinyLineChart';

function RechartJs() {
  return (
    <>
      <PageTitle pageContent={'ReChartJs'} activeMenu={'ReChartJs'} motherMenu={'Charts'} />
      <Row>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Bar</h4>
            </Card.Header>
            <Card.Body>
              <BarChartNoPadding />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Bar</h4>
            </Card.Header>
            <Card.Body>
              <NagetivePositive />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Line</h4>
            </Card.Header>
            <Card.Body>
              <TinyLineChart />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Line</h4>
            </Card.Header>
            <Card.Body>
              <LegendEffectOpacity />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default RechartJs;
