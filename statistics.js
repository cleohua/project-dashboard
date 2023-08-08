var template = /*html*/ `
<div></div>
`

export default {
    name: 'statisticsCompon',
    template,
    props: {
        type: {
            type: Number,
            default: 0,
        },
        date: {
            type: Date,
            default: () => new Date(),
        },
        options: {
            type: Object,
            default: () => { },
        },
        currenttab: {
            type: String,
        },
        hash: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {

        }
    },
    methods: {

    },
};