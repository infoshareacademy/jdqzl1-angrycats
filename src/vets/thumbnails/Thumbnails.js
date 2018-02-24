import React from 'react';
import '../Vets.css';
import {Grid, Col, Row, Thumbnail, ListGroup, ListGroupItem, Button, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import {connect} from 'react-redux'
import {markVetAsFavourite, deleteFromFavourite} from '../../app/actionCreators'

const mapStateToProps = (state) => ({
    vets: state.vetsData.vets,
    fetchingVets: state.vetsData.fetchingVets,
    offices: state.officesData.offices,
    fetchingOffices: state.officesData.fetchingOffices,
    matchName: state.vetsData.matchName,
    favouriteVetIds: state.favourites.favouriteVetIds
});

const mapDispatchToProps = (dispatch) => ({
    favouriteVet: (vetId) => dispatch(markVetAsFavourite(vetId)),
    deleteFromFavourite: (vetId) => dispatch(deleteFromFavourite(vetId))
})

class Thumbnails extends React.Component {

    render() {
        var {
            vets,
            fetchingVets,
            offices,
            fetchingOffices,
            matchName,
            favouriteVet,
            deleteFromFavourite,
            favouriteVetIds
        } = this.props;

        function fullName(firstName, lastName) {
            return (firstName + ' ' + lastName).toLowerCase();
        }

        function reversedFullName(firstName, lastName) {
            return (lastName + ' ' + firstName).toLowerCase();
        }

        let vetsCheck = vets.filter(function (vet) {
            return fullName(vet.firstName, vet.lastName).indexOf(matchName.toLowerCase()) !== -1
                || reversedFullName(vet.firstName, vet.lastName).indexOf(matchName.toLowerCase()) !== -1
        })

        return (

            <Grid>
                <Row className="flexbox thumb-row">
                    {fetchingVets ? "Ładuję weterynarzy..." : null}
                    {vetsCheck.length === 0 ?
                        <h3 key={vetsCheck}>Nie znaleziono weterynarza</h3> : vetsCheck.map((vet, index) => (

                        <Col className="thumb-col"
                             key={index} xs={12} sm={6} md={4} lg={3}>
                            <Thumbnail src={vet.photo}
                                       alt={vet.firstName}
                                       className="img-responsive vets-img image-rounded"
                                       id={vet.firstName}>
                                <Link to={`/vets/` + parseInt(index + 1, 10) }>
                                    <h3>{vet.firstName} {vet.lastName}</h3>
                                </Link>
                                <p>E-mail: {vet.email}</p>
                                <p>Telefon: {vet.phone}</p>

                                    <p>Przychodnie:</p>
                                    {fetchingOffices ? <p>Ładuję przychodnie...</p> : null}
                                    <ListGroup>
                                        {offices
                                            .filter(function (office) {
                                                var result = office.vetIds.indexOf(vet.id) !== -1;
                                                return result
                                            })
                                            .map(function (item) {
                                                return item
                                            })
                                            .map(function (office) {
                                                return (

                                                    <Link key={office.officeName}
                                                          to={`/offices/` + parseInt(office.id, 10)}>
                                                        <ListGroupItem
                                                            className='single-list-element'>{office.officeName}</ListGroupItem >
                                                    </Link>
                                                )
                                            })}
                                    </ListGroup>
                                    <p>Liczba porad lekarza: {vet.advices.length}</p>
                                    {favouriteVetIds.indexOf(vet.id) > -1 ?
                                        <Button onClick={() => deleteFromFavourite(vet.id)}>
                                            <Glyphicon glyph="minus"/>
                                        </Button>
                                        :
                                        <Button onClick={() => favouriteVet(vet.id)}>
                                            <Glyphicon glyph="heart"/>
                                        </Button>
                                    }
                                </Thumbnail>
                            </Col>
                        ))
                    }
                </Row>
            </Grid>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnails)