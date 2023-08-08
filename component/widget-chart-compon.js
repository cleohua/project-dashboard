// vue-chart
const widgetChartTemp = /*html*/ `
<div
    class="widget-chat-style"
>
    <div 
        class="widget-chat-header"
    >
        <div @click="generateData">隨機資料</div>
    </div>
    <component
        class="widget-chat-content"
        :class="{'loading': loading }"
        :is="currentCompon"
        :chart-data="chartData"
        ref="widget"
    ></component>
</div>
`

const vueChartLine = {
    extends: VueChartJs.Line,
    props: ["chartData"],
    methods: {
        render() {
            this.renderChart(
                this.chartData,
                {
                    responsive: true,
                    maintainAspectRatio: false,
                    // responsiveAnimationDuration: 200,
                    scales: {
                        yAxes: [{
                            ticks: {
                                // beginAtZero: true,
                                min: 0,
                                max: 100,
                                stepSize: 20,
                                fontColor: "#8c8c8c",
                                fontSize: 12,
                                maxTicksLimit: 20,
                                autoSkip: false,
                                // labelOffset: 10
                                padding: 5,
                            },
                            gridLines: {
                                color: "#2c2c2c",
                                drawBorder: true,
                                drawOnChartArea: true,
                                drawTicks: false,
                                // tickMarkLength: 5,
                            },
                        }],
                        xAxes: [
                            {
                                offset: true,
                                gridLines: {
                                    color: '#2c2c2c',
                                    drawBorder: false,
                                    drawOnChartArea: true,
                                    drawTicks: false,
                                    // tickMarkLength: 5,
                                },
                                ticks: {
                                    fontColor: "#8c8c8c",
                                    fontSize: 12,
                                    padding: 5,
                                }
                            }
                        ]
                    },
                    legend: {
                        labels: {
                            fontColor: "white",
                            fontSize: 14
                        }
                    },
                    // showLine: false // disable for all datasets
                }
            );
        }
    },
    watch: {
        chartData(newVal) {
            // console.log('on chartData change');
            if (newVal) this.render();
        }
    },
    mounted() {
        console.log('vue-chat-line-compon mounted');

        console.log(this);
        this.render();
    },
};

const vueChartPie = {
    extends: VueChartJs.Pie,
    props: {
        chartdata: {
            type: Object,
            default: () => { }
        }
    },
    mounted() {
        this.renderChart(
            this.chartdata,
            {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 20
                }
            }
        );
    },
};

export default {
    name: 'widget-chat-compon',
    template: widgetChartTemp,
    components: {
        'vue-chart-line': vueChartLine,
        'vue-chart-pie': vueChartPie,
    },
    props: {
        widgetData: {
            type: Object,
            default: () => ({
                //  'ID, Number',
                id: 0,
                //  'widget標題, String',
                title: '',
                //  'widget寬度, Number, 50/100',
                size: 50,
                //  'widget類型, String, form/chart',
                type: 'form',
                //  'chart才有, String, Line/Pie',
                chart_type: 'Line',
                //  '欄位與功能obj, Array, [colObj, ...]',
                columns: {},
                //  '欄位順位, Array, [col_id, ...]',
                order_cols: [],
                //  '欄位顯示, Array, [col_id, ...]',
                active_cols: [],
                //  '資料排序依據, Array, [col_id, ...], 單條件/多條件未定',
                sort_by: [],
                //  'options, optionObj, 還在想',
                options: {},
                //  'api&params, getObj',
                get: {},
            }),
        }
    },
    data() {
        return {
            loading: true,
            chartData: {},
        }
    },
    computed: {
        currentCompon() {
            switch (this.widgetData.chart_type) {
                case 'Pie':
                    return 'vue-chat-pie';
                case 'Line':
                default:
                    return 'vue-chat-line';
            }
        }
    },
    methods: {
        async refresh() {
            this.loading = true;
            // test for line
            const { api = '', params = [], post = false } = this.widgetData.get;

            let sendData = params.reduce((obj, key) => {
                switch (key) {
                    case '':

                        break;
                    default:
                        break;
                }

                return obj;
            }, {});

            let rsData = await callapi.getWidgetData(api, sendData, post);

            this.chartData = {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                ],
                datasets: [
                    {
                        label: "Data Line1",
                        // color: 'white',
                        backgroundColor: "#ecce2a",
                        borderColor: '#ecce2a',
                        // borderWidth: 3,
                        hoverBackgroundColor: "rgba(232,105,90,0.8)",
                        hoverBorderColor: "orange",
                        tension: 0.1,
                        fill: false,
                        data: [40, 39, 10, 40, 39, 80, 40],
                    },
                ],
            }

            // test for pie
            // this.chartData =  {
            //     labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
            //         datasets: [
            //             {
            //                 backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            //                 data: [40, 20, 80, 10]
            //             }
            //         ]
            // }

            this.loading = false;
        },
        generateData() {
            const newArray = () => {
                return new Array(7).fill(1)
                    .map(() => Math.floor(Math.random() * 100));
            }

            let newData = {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                ],
                datasets: [
                    {
                        label: `Data ${Math.floor(Math.random() * 100)}`,
                        // color: 'white',
                        backgroundColor: "#ecce2a",
                        borderColor: '#ecce2a',
                        borderWidth: 3,
                        hoverBackgroundColor: "rgba(232,105,90,0.8)",
                        hoverBorderColor: "orange",
                        tension: 0.1,
                        fill: false,
                        data: newArray(),
                    },
                    {
                        label: `Data ${Math.floor(Math.random() * 100)}`,
                        // color: 'white',
                        backgroundColor: "white",
                        borderColor: 'white',
                        borderWidth: 3,
                        hoverBackgroundColor: "rgba(232,105,90,0.8)",
                        hoverBorderColor: "orange",
                        tension: 0.1,
                        fill: false,
                        data: newArray(),
                    },
                ]
            };
            // console.log(newData);
            this.chartData = newData;
        }
    },
    created() {
        this.refresh();
        console.log(this);
    },
    mounted() {
        console.log('widget-chat-compon mounted');
        // const widget = this.$refs.widget;
        // const elm = widget.$el;
        // this.width = elm.clientWidth;
        // this.height = elm.clientHeigh;
        // widget.render();
    }
}