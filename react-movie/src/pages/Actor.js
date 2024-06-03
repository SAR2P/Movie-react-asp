import {Link} from "react-router-dom";
import { Button, Col, Nav, Row } from "react-bootstrap";
import ActorList from "../components/Actor-list";

const Actor = (props) => {
  return (
    <>
      <Row>
        <Col xs={12} md={10}>
          <h2>Actors</h2>
        </Col>
        <Col xs={12} md={2} className="align-self-center">
        <Button ><Nav.Link as={Link} to={'/actors/create-edit'}>Add New Actor</Nav.Link></Button>{' '}
        </Col>
      </Row>

      <ActorList />

    </>
  );
};

export default Actor;
