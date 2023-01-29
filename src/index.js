import React from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import DataTable, { defaultThemes } from 'react-data-table-component'

//style
import './css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

//Boostrap component
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'


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
                }
            ],
            data: []
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
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col className="align-start">
                                        <h6>Conti Corrente</h6>
                                    </Col>
                                    <Col className="align-end">
                                        <Button variant="primary" size="sm">
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
                                    data={this.state.data}/>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    componentDidMount() {
        this.getData()
    }

    async getData(){
        let response,
            rows = []
        try{
            response = await axios.get(`http://localhost:3000/api/accounts`)
            response = response.data
            for (const k in response) {
                rows.push({
                    id: parseInt(k),
                    nome: response[k].description,
                    bilancio: response[k].balance
                })
            }
            this.setState({
                data: rows
            })
            console.log(rows)
        }catch (err){
            return err
        }
    }
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Main/>)