import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem } from "reactstrap";
import { connect } from "react-redux";
import { getListings, deleteListing } from "../actions/listingActions";
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
          {listings.map(({ _id, title }) => (
            <ListGroupItem>
              Id: {_id} Title: {title}
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

export default connect(mapStateToProps, { getListings, deleteListing })(
  CarList
);
