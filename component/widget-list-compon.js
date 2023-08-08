import * as callapi from "../callAPI.js";
import { template, colTemp, cellElmTemp } from "../template/widget-list-temp.js";

const cellElmCompon = {
    name: 'cell-elm-compon',
    template: cellElmTemp,
    props: {
        data: {
            type: String,
            default: '',
        },
        options: {
            type: Object,
            default: () => { }
        },
        cellHeight: {
            type: Number,
            default: 25,
        },
        cellUnit: {
            type: String,
            default: 'px',
        }
    },
    computed: {
        style() {
            let styleText = `height: ${this.cellHeight}${this.cellUnit}; `;

            switch (this.options.type) {
                case 'status':
                    let refer = this.options.refer[this.data];
                    if (refer) {
                        const { color, bg, radius } = refer;
                        styleText += `color: ${color}; background: ${bg};`;
                        if (radius) {
                            styleText += `border-radius: ${radius};`;
                        }
                    }
                    break;
                case 'block':
                    styleText += `background: ${this.options.color[0]}`;
                    break;
                case 'text':
                    styleText += `color: ${this.options.color[0]}`;
                    break;
                case 'number':
                case 'persent':
                    if (this.options.threshold) {
                        let index = 0;
                        for (const val of this.options.threshold) {
                            if (val > this.data) {
                                break;
                            } else {
                                index++;
                            }
                        };

                        styleText += `color: ${this.options.color[index]}`;
                    } else {
                        styleText += `color: ${this.options.color[0]}`;
                    }
                    break;
                default:
                    styleText += `color: ${this.options.color[0]}`;
                    break;
            }

            return styleText;
        },
        text() {
            let text = '';
            switch (this.options.type) {
                case 'text':
                    text = this.data;
                    break;
                case 'status':
                    let refer = this.options.refer[this.data];
                    text = refer.text;
                    break;
                case 'user':
                    text = this.data.name;
                    break;
                case 'date':
                    text = moment(this.data).format('YYYY/MM/DD');
                    break;
                case 'persent':
                    text = `(${this.data}%)`;
                    break;
                default:
                    break;
            }

            return text;
        }
    },
    created() {
        // console.log(this);
    }
}

const colCompon = {
    name: 'colCompon',
    template: colTemp,
    components: {
        'cell-elm-compon': cellElmCompon,
    },
    props: {
        colId: {
            type: Number,
            default: 0
        },
        columnData: {
            type: Object,
            default: () => { }
        },
        dataObj: {
            type: Object,
            default: () => { }
        },
        start: {
            type: Number,
            default: 0
        },
        end: {
            type: Number,
            default: 0,
        },
        minWidth: {
            type: String,
            default: '100px',
        },
        level: {
            type: Number,
            default: 0,
        },
        hoverIndex: {
            type: Number,
            default: -1,
        },
        totalLevel: {
            type: Number,
            default: 1,
        },
        scrollTop: {
            type: Number,
            default: 0,
        },
        colUnitHeight: {
            type: Number,
            default: 25,
        }
    },
    data() {
        return {
            fitContent: false,
            columnUnit: 'px',
        }
    },
    computed: {
        // column
        colHeaderStyle() {
            if (this.level > 0) {
                return `height: ${this.colUnitHeight}${this.columnUnit}`;
            } else {
                const count = (colId, level = 1) => {
                    let column = this.columnData[colId];
                    if (column?.children?.length) {
                        return column.children.map(id => count(id, level + 1));
                    } else if (level > 1) {
                        return level;
                    } else {
                        return [level];
                    }
                }

                let levelArr = count(this.colId).flat(Infinity);
                let max = Math.max(...levelArr);
                let height = (this.totalLevel - max + 1) * this.colUnitHeight;
                return `height: ${height}${this.columnUnit}`;
            }
        },
        colInfo() {
            return this.columnData[this.colId] || {};
        },
        colTitleText() {
            return this.colInfo?.name || '';
        },
        colOptions() {
            return this.colInfo?.options || {};
        },
        cellStyleOptions() {
            return this.colOptions?.cellStyle || [];
        },
        colData() {
            return this.dataObj?.[this.colId] || [];
        },
        // cell
        currentData() {
            if (this.colData) {
                return this.colData.slice(this.start, this.end);
            } else {
                return [];
            }
        },
    },
    watch: {
        scrollTop(newVal, oldVal) {
            if (!this.colInfo.children?.length && newVal != oldVal) {
                this.$refs.content.scrollTop = newVal;
            }
        }
    },
    methods: {
        cellKeyIndex(index) {
            return this.start + index;
        },
        headerClick() {
            if (this.colInfo?.selectable) {

            }
            if (this.colInfo?.sortable) {
                this.$emit('sort', this.colId);
            }
        },
        cellClick(index) {
            this.$emit('cellclick', { colId: this.colId, index: this.start + index });
        },
        childSort(colId) {
            this.$emit('sort', colId);
        },
        childCellClick(data) {
            this.$emit('cellclick', data);
        },
        mouseOver(index) {
            this.$emit('over', index);
        },
        mouseLeave() {
            this.$emit('leave');
        },
        childOver(index) {
            this.$emit('over', index);
        },
        childLeave() {
            this.$emit('leave');
        },
        contentScroll(event) {
            const scrollTop = event.target.scrollTop;
            this.$emit('content-scroll', scrollTop);
        },
        onContentScroll(scrollTop) {
            this.$emit('content-scroll', scrollTop);
        }
    },
    // created() {
    //     console.log('column compon', this.colId);
    //     console.log(this);
    // }
}

export default {
    name: 'widget-list-compon',
    template,
    components: {
        'col-compon': colCompon,
        'v-select': VueSelect.VueSelect,
    },
    props: {
        widgetData: {
            type: Object,
            default: () => { }
        },
        columnData: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        const widgetOptions = this.widgetData?.options || {};
        // let start, end;
        const start = widgetOptions?.dateStart ? new Date(widgetOptions.dateStart) : new Date();
        const end = widgetOptions?.dateEnd ? new Date(widgetOptions.dateEnd) : new Date();

        // currentSelectList
        let curSelectList = [];
        if (widgetOptions.selectColumn?.length) {
            curSelectList = new Array(widgetOptions.selectColumn.length).fill(null);
        }

        return {
            loading: false,
            keyword: widgetOptions?.keyword || '',
            // v-date-picker
            range: {
                start,
                end,
            },
            masks: {
                range: {
                    input: 'YYYY/MM/DD',
                },
            },
            // v-select
            curSelectList,
            dataColIdRefer: [],
            data: [],
            activeColId: {},
            // column-header單位高
            colUnitHeight: 25,
            calScrollThumbHeight: false,
            // 分頁
            page: 0,
            partition: 10,
            hoverIndex: -1,
            showPageSelect: false,
            mouseY: 0,
            contentClientHeight: 0,
            contentScrollHeight: 0,
            contentScrollTop: 0,
            // custom scroll
            onThumbDown: false,
            observer: null,
        }
    },
    computed: {
        // widget options
        widgetOptions() {
            return this.widgetData?.options || {};
        },
        withDate() {
            return this.widgetOptions?.withDate || false;
        },
        dateRange() {
            return this.widgetOptions?.dateRange || false;
        },
        dateFormat() {
            return this.widgetOptions?.dateFormat || '';
        },
        hasDate() {
            return this.dateFormat.split('-').length == 3;
        },
        keywordFilter() {
            return this.widgetOptions?.keywordFilter || false;
        },
        dateStart: {
            get() {
                return this.widgetOptions?.dateStart || '';
            },
            set(value) {
                if (this.widgetOptions) {
                    this.widgetOptions.dateStart = value;
                }
            }
        },
        dateEnd: {
            get() {
                return this.widgetOptions?.dateEnd || '';
            },
            set(value) {
                if (this.widgetOptions) {
                    this.widgetOptions.dateEnd = value;
                }
            }
        },
        // selectList
        selectList() {
            return (col_id) => {
                const col = this.columnData[col_id];
                return col.options.labels;
            }
        },
        // data process
        // 順序
        col_order() {
            return this.widgetData?.order_cols || [];
        },
        // 可見
        col_active() {
            return this.widgetData?.active_cols || [];
        },
        // 提出active
        currentOrder() {
            const child = (colId) => {
                const column = this.columnData[colId];
                if (column?.children?.length) {
                    return column.children.map(id => child(id));
                } else if (this.col_active.includes(colId)) {
                    return colId;
                }
            }

            let arr = this.col_order.reduce((arr, id) => {
                const column = this.columnData[id];
                if (column?.children?.length) {
                    let childArr = child(id);
                    arr.push(childArr);
                } else if (this.col_active.includes(id)) {
                    arr.push(id);
                }
                return arr;
            }, []);

            return arr.flat(Infinity);
        },
        // column反指向data index
        mapDataIndex() {
            if (this.dataColIdRefer.length && this.currentOrder.length) {
                return this.currentOrder.map(id => {
                    return this.dataColIdRefer.findIndex(referId => referId == id);
                });
            } else {
                return [];
            }
        },
        // step0
        // user special select
        // step1
        dateTypeIndex() {
            let arr = this.mapDataIndex.reduce((arr, referIndex, index) => {
                const column = this.columnData[this.currentOrder[index]];
                if (column?.type == 'date') arr.push(referIndex);
                return arr;
            }, []);
            return arr;
        },
        // date range filter
        // 應只有一個時間才有效
        dateFilter() {
            if (this.data?.length && this.withDate && this.dateTypeIndex.length) {
                this.data.filter(listData => {
                    let date = listData[this.dateTypeIndex[0]];
                    let thisDate = monent(date);
                    let dateStart = moment(this.dateStart);

                    // year-month
                    if (!this.hasDate) {
                        dateStart = moment([dateStart.year(), dateStart.month(), dateStart.date()]);
                    }

                    // 是時間區間
                    if (this.dateRange) {
                        let dateEnd = monent(this.dateEnd);
                        return thisDate.isSameOrBefore(dateStart)
                            && thisDate.isSameOrAfter(dateEnd);
                    } else {
                        return thisDate.isSame(dateStart);
                    }
                });
            } else {
                return this.data || [];
            }
        },
        // step2
        // keyword filter
        // 可被關鍵字篩選的columns
        searchableIndex() {
            let arr = this.mapDataIndex.reduce((arr, referIndex, index) => {
                const column = this.columnData[this.currentOrder[index]];
                if (column?.searchable) arr.push(referIndex);
                return arr;
            }, []);

            return arr;
        },
        keywordLow() {
            return this.keyword.toLowerCase();
        },
        keywordFilterData() {
            if (this.keywordFilter) {
                return this.dateFilter.filter(({ data }) => {
                    return this.searchableIndex
                        .map(i => this.keyMatch(data[i].data.join('')))
                        .includes(true);
                });
            } else {
                return this.dateFilter;
            }
        },
        // setp3
        // select filter
        selectFilterData() {
            const hasSelect = this.curSelectList.every(val => val != null);
            if (hasSelect) {
                const match = (select, cellObj) => {
                    const { uid = 0 } = cellObj;

                    return select == uid;
                }

                const testAll = (index, select, data) => {
                    const colId = this.widgetOptions.selectColumn[index];
                    const targetIndex = this.currentOrder.findIndex(id => id == colId);

                    return match(select, data[this.mapDataIndex[targetIndex]]);
                }

                return this.keywordFilterData.filter(({ data }) => {
                    return !this.curSelectList.map((select, index) => {
                        return select ? testAll(index, select, data) : true;
                    }).includes(false);
                });
            } else {
                return this.keywordFilterData;
            }
        },
        // step4
        // sort
        sortableIndex() {
            return this.mapDataIndex.reduce((arr, referIndex, index) => {
                const column = this.columnData[this.currentOrder[index]];
                if (column?.sortable) arr.push(referIndex);
                return arr;
            }, []);
        },
        sortData() {
            // TODO: before keyword filter
            return this.selectFilterData;
        },
        currentDataObj() {
            let dataObj = {};
            this.sortData.forEach(listData => {
                this.currentOrder.forEach((colId, index) => {
                    let target = dataObj[colId] ||= [];
                    target.push(listData.data[this.mapDataIndex[index]]);
                });
            });
            // console.log('currentDataObj');
            // console.log(dataObj);

            return dataObj;
        },
        // column 總層數
        totalLevel() {
            const count = (colId, level = 1) => {
                let column = this.columnData[colId];
                if (column?.children?.length) {
                    return column.children.map(id => count(id, level + 1));
                } else if (level > 1) {
                    return level;
                } else {
                    return [level];
                }
            }

            let levelArr = this.col_order.map(id => count(id)).flat(Infinity);
            return Math.max(...levelArr);
        },
        tarckHeight() {
            return this.totalLevel * this.colUnitHeight + 1;
        },
        contentScrollTrackStyle() {
            return `top: ${this.tarckHeight}px;`;
        },
        columnContentEl() {
            if (this.calScrollThumbHeight) {
                const col = this.$refs.colCompon?.[0];
                return col.$refs.content;
            } else {
                return false;
            }
        },
        contentDiff() {
            return this.contentScrollHeight - this.contentClientHeight;
        },
        thumbHeight() {
            return this.contentClientHeight - this.contentDiff + 1;
        },
        contentScrollThumbStyle() {
            if (this.columnContentEl) {
                if (this.contentDiff > 0) {
                    return `height: ${this.thumbHeight}px; top: ${this.contentScrollTop}px;`;
                } else {
                    return `display: none; top: 0;`;
                }
            } else {
                return `display: none; top: 0;`;
            }
        },
        // 分頁段落
        count() {
            return this.sortData.length;
        },
        start() {
            return this.page * this.partition;
        },
        end() {
            return this.count ? this.start + this.partition : 0;
        },
        hasForward() {
            return this.page > 0;
        },
        hasNext() {
            return this.end < this.count;
        },
        pageList() {
            if (this.count) {
                const maxPage = Math.ceil(this.count / this.partition);
                return new Array(maxPage).fill(0).map((v, i) => v + i);
            } else {
                return [];
            }
        },
        pageSelectClass() {
            return `flip-up${this.showPageSelect ? ' show' : ''}`;
            // const boundary = window.innerHeight * 0.85;
            // return this.mouseY > boundary ? 'flip-up' : 'flip-down';
        },
    },
    watch: {
        // order_cols(newVal) {
        //     console.log('order_cols change', newVal);
        // },
        page(newVal, oldVal) {
            if (newVal != oldVal) this.contentScrollTop = 0;
        },
        keyword() {
            this.page = 0;
        },
        range: {
            handler() {
                this.page = 0;
            },
            deep: true,
        },
        curSelectList() {
            // console.log(this.curSelectList);
            this.page = 0;
        },
    },
    methods: {
        async getData() {
            let get = this.widgetData?.get || {};
            const { api, params, post = false } = get;
            const sendData = params.reduce((obj, key) => {
                switch (key) {
                    case 'user_id':
                    case 'sys_code_id':
                        break;
                    default:
                        console.warn('key not match: ', key);
                        break;
                };

                return obj;
            }, {});

            let rsData = await callapi.getWidgetData(api, sendData, post);
            // console.log(rsData);

            return rsData;
        },
        async refresh() {
            this.loading = true;
            this.calScrollThumbHeight = false;
            this.observer.disconnect();

            let rsData = await this.getData();
            if (rsData) {
                this.data = [];
                this.page = 0;
                const { col_id_refer = [], list = [] } = rsData;
                this.data = list;
                this.dataColIdRefer = col_id_refer;
                await this.$nextTick();
            }

            this.calScrollThumbHeight = true;
            this.observer.observe(this.columnContentEl);
            this.loading = false;
        },
        keyMatch(str) {
            if (this.keywordLow.length) {
                return str.toLowerCase().includes(this.keywordLow);
            } else {
                return true;
            }
        },
        onSortClick(colId) {

        },
        onCellClick({ colId, index }) {
            let uid = this.data[index].uid;
            if (uid) {
                console.log(uid);
            }
        },
        mouseOver(index) {
            this.hoverIndex = index;
        },
        mouseEnter(index) {
            this.hoverIndex = index;
        },
        mouseLeave() {
            this.hoverIndex = -1;
        },
        forwardClick() {
            if (this.hasForward) this.page--;
        },
        nextClick() {
            if (this.hasNext) this.page++;
        },
        pageSelectClick(event) {
            // console.log('pageSelectClick');
            // console.log(event);
            this.mouseY = event.pageY;
            this.showPageSelect = !this.showPageSelect;
        },
        onContentScroll(scrollTop) {
            // this.contentScrollTop = scrollTop;
        },
        contentWheel(evt) {
            if (!evt.shiftKey) {
                let position = evt.deltaY > 0;
                this.thumbMove(position ? 15 : -15);
            }
        },
        trackClick(evt) {
            if (this.onThumbDown) {
                this.onThumbDown = false;
            } else {
                const offsetY = evt.offsetY;
                const scrollHeigh = this.$refs.contentScroll.clientHeight;

                if (offsetY > this.contentScrollTop) {
                    const curentHeight = this.thumbHeight + this.contentScrollTop;
                    let range = (scrollHeigh - curentHeight) / 3;
                    if (range < scrollHeigh / 6) range = 1000;

                    this.thumbMove(range);
                } else {
                    let range = this.contentScrollTop / 3;
                    if (range < scrollHeigh / 6) range = 1000;
                    
                    this.thumbMove(range * -1);
                }
            }
        },
        thumbDown() {
            this.onThumbDown = true;
        },
        thumbUp() {
            this.onThumbDown = false;
        },
        thumbMove(moveY) {
            const newVal = this.contentScrollTop + moveY;
            if (moveY > 0) {
                const diff = this.contentScrollHeight - this.contentClientHeight;
                if (this.contentScrollTop < diff) {
                    this.contentScrollTop = newVal > diff ? diff : newVal;
                }
            } else {
                this.contentScrollTop = newVal < 0 ? 0 : newVal;
            }
        },
        docClick() {
            this.onThumbDown = false;
        },
        docMove(evt) {
            if (this.onThumbDown) this.thumbMove(evt.movementY);
        },
    },
    created() {
        console.log('widget-list-compon created');
        console.log(this);
        this.observer = new ResizeObserver((entries) => {
            this.contentClientHeight = entries[0].target.clientHeight;
            this.contentScrollHeight = entries[0].target.scrollHeight;
        });
    },
    mounted() {
        this.refresh();
        document.addEventListener('click', this.docClick);
        document.addEventListener('mousemove', this.docMove);
    },
    destroyed() {
        document.removeEventListener('click', this.docClick);
        document.removeEventListener('mousemove', this.docMove);
        this.observer?.disconnect();
    }
}