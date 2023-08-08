// 個人化設定
// getCustomProfile -> user_id, sys_code_id
// return <-
const profileData = {
    widgetOrder: 'wiget排列順序, Array, [widget_id, ...]',
    widgetSet: '覆蓋, Object, {colId: {}}'
}

// getWidgetList -> user_id, sys_code_id
// return <-  
const widgetListData = {
    widget: ', Array, widgetList',
    columns: '欄位資訊提供對照, Object, {col_id: columnObj }',
}

const widgetList = [
    // type: form
    {
        id: 'ID, Number',
        title: 'widget標題, String',
        size: 'widget寬度, 可調選項, Number, 50/100',
        type: 'widget類型, String, form/chart',
        columns: '預設欄位順位, Array, [col_id, ...]',
        order_cols: '欄位順位, 可調選項, Array, [col_id, ...]',
        active_cols: '欄位顯示, 可調選項, Array, [col_id, ...]',
        sort_by: '資料排序依據, 可調選項, Array, [col_id, ...], 單條件/多條件未定',
        options: 'options, widgetOptionsObj',
        get: 'api&params, getObj',
    },
    //  type: chart
    {
        id: 'ID, Number',
        title: 'widget標題, String',
        size: 'widget寬度, 可調選項, Number, 50/100',
        type: 'widget類型, String, form/chart/mix',
        chart_type: 'chart才有, String, Line/Pie...',
        options: 'options, widgetOptionsObj',
        get: 'api&params, getObj',
    },
];

// 欄位內容值
// key: col_id,
// value: 內容array
const list = '欄位內容object, {col_id: [String, ...]}'

const widgetOptionsObj = {
    withDate: '顯示月份篩選, Boolean',
    dateFormat: '日期格式, String, YYYY-MM-DD',
    dateRange: '有日期才有效, Boolean',
    dateStart: '指定開始日期, String, YYYY-MM-DD/YYYY-MM',
    dateEnd: '指定結束, String, YYYY-MM-DD/YYYY-MM',
    keywordFilter: '顯示關鍵字搜尋, Boolean',
    keyword: '字串, String',
    withSelect: '有下拉選單, Boolean',
    selectColumn: '使用者可篩選對象, Array, [col_id, ...]'
}

// form欄位設定
const columnObj = {
    name: 'name, String',
    sortable: '可否排序, Boolean',
    filterable: '可否篩選, Boolean',
    selectable: '可否指定內容篩選, Boolean',
    searchable: '可否關鍵字篩選, Boolean',
    options: '欄位細節設定, Object',
    children: '子項, Array, [col_id, ...]'
}

// colOptionsObj
const colOptionsObj = {
    width: '寬度, Number',
    cellStyle: '欄位數值顏色對照, Array, [cellStyleObj, ...]',
    labels: '可篩選需要,所有欄位值, Array, [{id, text}, ...]'
}

// 樣式顏色條件判斷
const cellStyleObj = {
    threshold: '有分級才有,基準值, Array, [50]/[30/60/90]',
    color: '對應顏色, Array, [$color, $color]',
    refer: '狀態類型才有,對應顏色與文字, Object, {status_id: statusColorObj}',
    selectOptions: '',
    type: '資料類型, String, text/number/persent/date/user/status/block'
}

// 狀態標籤顏色
const statusColorObj = {
    color: '文字色, String, $color',
    bg: '背景色, String, $color',
    radius: '導圓, String, "$numberpx"',
    text: '狀態名稱, String',
}

// 取得 widget 內容Data
const getObj = {
    api: 'api string, String',
    params: '需要參數, Array',
    post: '是否為 post, Boolean',
}
// return <-
const widgetData = {
    count: '總筆數， Number',
    col_id_refer: 'col_id 順序對應, Array, [col_id, ...]',
    list: '資料, Array, [dataObj, ...]',
}

// dataObj
const dataObj = {
    data: '表格欄位資料, Array, [cellObj, ...]',
    uid: '該欄資料uid 如果有的話, Number',
}

const cellObj = {
    data: 'cell資料array, Array',
    uid: '該cell資料uid 如果有的話, Number',
}

// 圖表data
// Line
const chartData = {
    title: '圖表標題, String, if needed',
    labels: 'X-軸, Array, [String, ...]',
    datasets: '線圖資料, Array, [datasetObj, ...]',
}

const lineDatasetObj = {
    label: '圖例名稱, String',
    backgroundColor: 'String',
    borderColor: 'String',
    hoverBackgroundColor: 'String',
    hoverBorderColor: 'String',
    fill: '面積填色, Boolean',
    data: '數值, Array',
}