import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { v4 as uuid } from "uuid";

class CarList extends Component {
  state = {
    listings: [
      {
        id: uuid(),
        title: "Title 1"
      },
      {
        id: uuid(),
        title: "Title 2"
      },
      {
        id: uuid(),
        title: "Title 3"
      },
      {
        id: uuid(),
        title: "Title 4"
      }
    ]
  };

  render() {
    const { listings } = this.state;
    return (
      <Container>
        <ListGroup>
          {listings.map(({ id, title }) => (
            <ListGroupItem>
              Id: {id} Title: {title}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>
    );
  }
}

export default CarList;
