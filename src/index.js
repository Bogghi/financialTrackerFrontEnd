import React from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import DataTable, { defaultThemes } from 'react-data-table-component'

//style
import './css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//Boostrap component
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form';


class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            columns: [
                {
                    name: 'nome',
                    selector: row => row.nome,
                    sortable: true
                },
                {
                    name: 'bilancio',
                    selector: row => row.bilancio,
                    sortable: true
                },
                {
                    name: 'descrizione',
                    selector: row => row.description,
                    sortable: true
                },
                {
                    name: 'data creazione',
                    selector: row => row.creationDate,
                    sortable: true
                }
            ],
            data: [],
            show: false
        }
        this.customStyles = {
            header: {
                style: {
                    minHeight: '56px',
                },
            },
            headRow: {
                style: {
                    borderTopStyle: 'solid',
                    borderTopWidth: '1px',
                    borderTopColor: defaultThemes.default.divider.default,
                },
            },
            headCells: {
                style: {
                    '&:not(:last-of-type)': {
                        borderRightStyle: 'solid',
                        borderRightWidth: '1px',
                        borderRightColor: defaultThemes.default.divider.default,
                    },
                },
            },
            cells: {
                style: {
                    '&:not(:last-of-type)': {
                        borderRightStyle: 'solid',
                        borderRightWidth: '1px',
                        borderRightColor: defaultThemes.default.divider.default,
                    },
                },
            },
        }
    }

    render(){
        return (
            <div className="main">
                <Container fluid>
                    <Row>
                        <Col>
                            <h3>Gestione Monetaria</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Row>
                                        <Col className="align-start">
                                            <h6>Conti Corrente</h6>
                                        </Col>
                                        <Col className="align-end">
                                            <Button variant="primary" size="sm" onClick={() => this.showModalAdd()}>
                                                Aggiungi Conto Corrente
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body className="no-padding">
                                    <DataTable
                                        columns={this.state.columns}
                                        defaultSortFieldId={1}
                                        customStyles={this.customStyles}
                                        dense
                                        selectableRows
                                        data={this.state.data}/>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <Modal show={this.state.show} onHide={() => this.hideModalAdd()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Aggiungi un conto corrente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="accountName">
                                <Form.Label>Nome conto corrente</Form.Label>
                                <Form.Control type="text" placeholder="Intesa San Paolo"
                                    form="add-account" name="name" required/>
                            </Form.Group>
                            <Form.Group controlId="accountDescription">
                                <Form.Label>Descrizione</Form.Label>
                                <Form.Control type="text" placeholder="Risparmi"
                                    form="add-account" name="description"/>
                            </Form.Group>
                            <Form.Group controlId="accountBalance">
                                <Form.Label>Bilancio</Form.Label>
                                <Form.Control type="number" placeholder="1000"
                                    form="add-account" name="balance" required/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.hideModalAdd()}>
                            Annulla
                        </Button>
                        <Button varian="primary" onClick={() => this.addAccount()}>
                            Salva
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        this.getData()
    }

    async getData(){
        let response,
            rows = []
        try{
            response = await axios.get(`http://localhost:3000/api/accounts/get`)
            response = response.data
            for (const k in response) {
                rows.push({
                    id: parseInt(k),
                    nome: response[k].name,
                    bilancio: response[k].balance,
                    description: response[k].description,
                    creationDate: response[k].insert_date.replace(/T/, ' ').replace(/\..+/, '')
                })
            }
            this.setState({
                data: rows
            })
        }catch (err){
            console.log(err)
        }
    }
    showModalAdd(){
        this.setState({
            show: true
        })
    }
    hideModalAdd(){
        this.setState({
            show: false
        })
    }
    async addAccount(){
        let account = {},
            ok = true

        document.querySelectorAll(`[form="add-account"]`).forEach((e, i) => {
            account[e.getAttribute('name')] = e.value
            if(e.hasAttribute('required') && e.value.length === 0)
                ok = false
        })

        console.log(ok)
        if(!ok)
            return console.log('porcodio')

        const response = await axios.post(
            `http://localhost:3000/api/accounts/add`,
            account
        )

        this.hideModalAdd()
        this.getData()
    }
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Main/>)