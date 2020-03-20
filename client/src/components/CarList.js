import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { v4 as uuid } from "uuid";
import { connect } from "react-redux";
import { getListings } from "../actions/listingActions";
import PropTypes from "prop-types";

class CarList extends Component {
  componentDidMount() {
    this.props.getListings();
  }

  render() {
    const { listings } = this.props.listing;
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

CarList.propTypes = {
  getListings: PropTypes.func.isRequired,
  listing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  listing: state.listing
});

export default connect(mapStateToProps, { getListings })(CarList);
