import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import PageTitle from "../../../layouts/PageTitle";

const BarChart1 = loadable(() =>
	pMinDelay(import("./bar1"), 500)
);
const BarChart5 = loadable(() =>
	pMinDelay(import("./bar5"), 500)
);
const BarChart6 = loadable(() =>
	pMinDelay(import("./bar6"), 500)
);
const LineChart1 = loadable(() =>
	pMinDelay(import("./line1"), 500)
);
const DualLine = loadable(() =>
	pMinDelay(import("./dualLine"), 500)
);
const BasicArea = loadable(() =>
	pMinDelay(import("./basicArea"), 500)
);
const GradientArea = loadable(() =>
	pMinDelay(import("./dualArea"), 500)
);
const DualArea = loadable(() =>
	pMinDelay(import("./gradinetArea"), 500)
);
const PolarChart = loadable(() =>
	pMinDelay(import("./polar"), 500)
);
const ChartPie = loadable(() =>
	pMinDelay(import("./pie"), 500)
);

function ChartChartjs() {
  return (
    <>
        <PageTitle pageContent={'ChartJs'} activeMenu={'ChartJs'} motherMenu={'Charts'} />
        <Row>
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Bar chart</h4>
              </Card.Header>
              <Card.Body>
                <BarChart1 />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Bar chart</h4>
              </Card.Header>
              <Card.Body>
                <BarChart5 />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Bar chart</h4>
              </Card.Header>
              <Card.Body>
                <BarChart6 />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Line chart</h4>
              </Card.Header>
              <Card.Body>
                <LineChart1  />
              </Card.Body>
            </Card>
          </Col> 
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Dual Line chart</h4>
              </Card.Header>
              <Card.Body>
                <DualLine />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Basic Area Chart</h4>
              </Card.Header>
              <Card.Body>
                <BasicArea />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Gradinet Area Chart</h4>
              </Card.Header>
              <Card.Body>
                <GradientArea />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Dual Area Chart</h4>
              </Card.Header>
              <Card.Body>
                <DualArea />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Pie</h4>
              </Card.Header>
              <Card.Body>
                <ChartPie />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card>
              <Card.Header>
                  <h4 className="card-title">Polar Chart</h4>
              </Card.Header>
              <Card.Body>
                <PolarChart />
              </Card.Body>
            </Card>
          </Col>  
        </Row>
        
    </>
  );
}

export default ChartChartjs;
