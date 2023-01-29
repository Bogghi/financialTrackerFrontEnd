import React from 'react'
import { createRoot } from 'react-dom/client';
import axios from 'axios'
import DataTable from 'react-data-table-component';

//Boostrap component
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            columns: [
                {
                    name: 'nome',
                    selector: row => row.nome
                },
                {
                    name: 'bilancio',
                    selector: row => row.bilancio
                }
            ],
            data: []
        }
    }

    render(){
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <DataTable columns={this.state.columns} data={this.state.data}/>
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