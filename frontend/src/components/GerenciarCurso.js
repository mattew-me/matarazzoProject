import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container, Row, Col, Table, Button
} from 'react-bootstrap';
import { FiTrash, FiEdit } from 'react-icons/fi';
import api from '../services/api.js';

export default function GerenciarCurso(props) {
    const history = useHistory();

    const [checado, setChecado] = useState(false);
    const [checado2, setChecado2] = useState(false);
    const [erroMsg, setErroMsg] = useState('');
    const [sucessoMsg, setSucessoMsg] = useState('');

    const [modal, setModal] = useState(null);

    const [categorias, setCategoria] = useState([]);
    const [cursos, setCurso] = useState([]);

    const [cur_id, setIdCur] = useState('');
    const [cur_nome, setNomeCur] = useState('');
    const [cur_status, setStatusCur] = useState('');
    const [cur_adm, setAdmCur] = useState(props.usuario);
    const [cur_categoria, setCategoriaCur] = useState('DEFAULT');
    const [cur_valor, setValorCur] = useState('');
    const [cur_img, setImgCur] = useState('');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function removerCurso(id) {
        await api.delete(`/cursos/${id}`);
        carregarCursos();
    }

    async function editarCurso(id) {
        setIdCur(id);
        const response = await api.get('/cursos/' + id);
        setNomeCur(response.data[0].cur_nome);
        setValorCur(response.data[0].cur_valor);
        setStatusCur(response.data[0].cur_status);
        setChecado(false);
        setChecado2(true);
        if (response.data[0].cur_status === 'A') {
            setChecado(true);
            setChecado2(false);
        }
        setAdmCur(response.data[0].usu_id);
        setImgCur(response.data[0].cur_img);
        setCategoriaCur(response.data[0].cat_id);
        setModal(true);
    }

    async function carregarCursos() {
        const response = await api.get('/cursos');
        setCurso(response.data);
    }

    async function uploadImgCurso() {
        const imgData = new FormData();
        imgData.append('cur_img', cur_img);

        const resUpload = await api.post('/upload/cursos', imgData, {
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        });

        setImgCur(resUpload.data);
        setSucessoMsg('Imagem adicionada com sucesso!');
        await sleep(3000);
        setSucessoMsg(false);
    }

    async function adicionarCurso(e) {
        e.preventDefault();

        if (cur_nome && cur_status && cur_img && cur_categoria && cur_adm && cur_valor) {
            if (props.flag === 'add') {
                await api.post('/cursos', {
                    cur_nome, cur_status, cur_adm, cur_valor,
                    cur_img, cur_categoria
                });
                setSucessoMsg('Curso adicionado com sucesso!');
            } else {
                await api.put('/cursos/', {
                    cur_nome, cur_status, cur_adm,
                    cur_valor, cur_img,
                    cur_categoria, cur_id
                });
                setSucessoMsg('Curso atualizado com sucesso!');
            }

            limparFormCurso();
            await sleep(3000);
            setSucessoMsg(false);
            carregarCursos();
        } else {
            setErroMsg('Preencha todos os campos!');
            await sleep(3000);
            setErroMsg(false);
        }
    }

    useEffect(() => {
        if (props.nivel !== 'A') history.push('/');
        else {
            carregarCategorias("C");
            carregarCursos();
            setModal();
            return () => {
                setCategoria({});
                setCurso({});
            };
        }
    }, [props.nivel, history]);

    async function carregarCategorias(tipoCat) {
        const response = await api.get('/categorias/tipo/' + tipoCat);
        setCategoria(response.data);
    }

    function limparFormCurso() {
        setChecado(false);
        setChecado2(false);
        setNomeCur('');
        setStatusCur('');
        setCategoriaCur('DEFAULT');
        setAdmCur(props.usuario);
        setValorCur('');
        setImgCur('');
    }

    if (props.flag === 'add')
        return (
            <Container>
                <Row className='align-items-center justify-content-center'>
                    <div style={{ minWidth: '50vh' }}>
                        <h3 className='title'>Adicionar Novo Curso</h3>
                        <form
                            method='post'
                            encType='multipart/form-data'
                            onSubmit={adicionarCurso}>
                            <div className='form-col form-group'>
                                <div className='col'>
                                    <input
                                        className='form-ctrl'
                                        type='text'
                                        name='cur_nome'
                                        id='cur_nome'
                                        value={cur_nome}
                                        onChange={e => {
                                            setNomeCur(e.target.value);
                                            setErroMsg(false);
                                            setSucessoMsg(false);
                                        }}
                                        placeholder='Nome do curso...'></input>
                                    <div className='mt-2 custom-control custom-radio custom-control-inline'>
                                        <input
                                            checked={checado}
                                            onChange={e => {
                                                setStatusCur('A'); setChecado(true);
                                                setChecado2(false); setErroMsg(false);
                                                setSucessoMsg(false);
                                            }}
                                            type='radio'
                                            id='cur_status_ativo'
                                            name='cur_status'
                                            className='custom-control-input'
                                        />
                                        <label
                                            className='custom-control-label'
                                            htmlFor='cur_status_ativo'>
                                            Ativo
                                                                    </label>
                                    </div>

                                    <div className='custom-control custom-radio custom-control-inline'>
                                        <input
                                            checked={checado2}
                                            onChange={e => {
                                                setStatusCur('I'); setChecado2(true);
                                                setChecado(false); setErroMsg(false);
                                                setSucessoMsg(false);
                                            }}
                                            type='radio'
                                            id='cur_status_inativo'
                                            name='cur_status'
                                            className='custom-control-input'
                                        />
                                        <label
                                            className='custom-control-label'
                                            htmlFor='cur_status_inativo'>
                                            Inativo
                                                                    </label>
                                    </div>
                                    <div className='form-row form-group pt-1 mb-0 align-items-center'>
                                        <Col>
                                            <select
                                                name='cur_cat'
                                                className='custom-select'
                                                value={cur_categoria}
                                                onChange={e => {
                                                    setCategoriaCur(e.target.value);
                                                    setErroMsg(false); setSucessoMsg(false);
                                                }}>
                                                <option
                                                    value='DEFAULT'
                                                    disabled>
                                                    Escolher categoria...
                                                </option>
                                                {Object.keys(categorias).map((key, index) => (
                                                    <option
                                                        key={categorias[key].cat_id}
                                                        value={categorias[key].cat_id}>
                                                        {categorias[key].cat_nome}
                                                    </option>
                                                )
                                                )}
                                            </select>
                                        </Col>
                                        <Col>
                                            <input
                                                className='form-ctrl'
                                                type='text'
                                                name='cur_valor'
                                                id='cur_valor'
                                                value={cur_valor}
                                                onChange={e => {
                                                    setValorCur(e.target.value);
                                                    setErroMsg(false);
                                                    setSucessoMsg(false);
                                                }}
                                                placeholder='Valor do curso...'></input>
                                        </Col>
                                    </div>
                                    <div className='form-row form-group pt-1 mb-0 align-items-center'>
                                        <Col xs={9}>
                                            <div className='custom-file mt-2'>
                                                <input
                                                    type='file'
                                                    name='cur_img'
                                                    className='custom-file-input'
                                                    onChange={e => {
                                                        setImgCur(e.target.files[0]);
                                                        setErroMsg(false);
                                                        setSucessoMsg(false);
                                                    }}
                                                    id='cur_img'
                                                />
                                                <label
                                                    className='custom-file-label form-ctrl'
                                                    htmlFor='cur_img'>
                                                    Escolher Imagem
                                                                            </label>
                                            </div>
                                        </Col>
                                        <Col xs={1}>
                                            <input
                                                type='button'
                                                className='btn bg-brown mt-2'
                                                onClick={uploadImgCurso}
                                                value='Enviar'
                                            />
                                        </Col>
                                    </div>
                                </div>
                            </div>
                            <Col>
                                {erroMsg ? (<span className='erro'>{erroMsg}</span>) : null}
                                {sucessoMsg ? (<span className='sucesso'>{sucessoMsg}</span>) : null}
                            </Col>
                            <div className='form-group d-flex flex-row-reverse p-3 mb-0'>
                                <button
                                    className='btn bg-brown w-30'
                                    type='submit'>
                                    ADICIONAR
                                                            </button>
                            </div>
                        </form>
                    </div>
                </Row>
            </Container>
        );
    else
        return (
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>#</th><th>Nome</th><th>Status</th><th>Valor</th><th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.length !== 0
                        ? Object.keys(cursos).map((key, index) => (
                            <tr key={`${cursos[key].cur_id}`}>
                                <td>{cursos[key].cur_id}</td>
                                <td>{cursos[key].cur_nome}</td>
                                <td>{cursos[key].cur_status}</td>
                                <td>{cursos[key].cur_valor}</td>
                                <td>
                                    <Button
                                        onClick={() => editarCurso(cursos[key].cur_id)}
                                        className='m-0 p-0 border-0 bg-transparent'>
                                        <FiEdit style={{ color: '#231f20' }} />
                                    </Button>

                                    <Button
                                        onClick={() => removerCurso(cursos[key].cur_id)}
                                        className='ml-2 p-0 border-0 bg-transparent'>
                                        <FiTrash style={{ color: '#231f20' }} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                        : <tr>
                            <td colSpan='5'> Não há cursos cadastrados</td>
                        </tr>
                    }
                </tbody>
            </Table>
        );
}