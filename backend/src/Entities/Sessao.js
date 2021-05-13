class Sessao {
    constructor(eve_id, ses_id, ses_horarioInicio, ses_qtdeIng, ses_freq, sal_id, ses_data) {
        this.eve_id = eve_id;
        this.ses_id = ses_id;
        this.ses_horarioInicio = ses_horarioInicio;
        this.ses_qtdeIng = ses_qtdeIng;
        this.ses_freq = ses_freq;
        this.sal_id = sal_id;
        this.ses_data = ses_data;
    }

    static semID(eve_id, ses_horarioInicio, ses_qtdeIng, ses_freq, sal_id, ses_data) {
        return new Sessao(eve_id, 0, ses_horarioInicio, ses_qtdeIng, ses_freq, sal_id, ses_data);
    }

    getId() {
        return this.ses_id;
    }

    setId(id) {
        return this.ses_id = id;
    }

    getEveId() {
        return this.eve_id;
    }

    setEveId(id) {
        return this.eve_id = id;
    }

    getHorarioInicio() {
        return this.ses_horarioInicio;
    }

    setHorarioInicio(horarioInicio) {
        return this.ses_horarioInicio = horarioInicio;
    }

    getQtdeIng() {
        return this.ses_qtdeIng;
    }

    setQtdeIng(qtdeIng) {
        return this.ses_qtdeIng = qtdeIng;
    }

    getFreq() {
        return this.ses_freq;
    }

    setFreq(freq) {
        return this.ses_freq = freq;
    }

    getSalId() {
        return this.sal_id;
    }
    setSalId(id) {
        return this.sal_id = id;
    }

    getData() {
        return this.ses_data;
    }

    setDataIni(data) {
        return this.ses_data = data;
    }

}

module.exports = Sessao;


