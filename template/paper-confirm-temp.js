var template = /*html*/ `
<full-size    
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnText="nextBtnText"
    :returnBtnText="returnBtnText"
    @nextBtnClick="nextBtnClick"
    @close="closeClick"
    ref="dialog"
>
    <div 
        :class="{'loading': loading}"
    >
        <template
            v-if="dataList.length"
        >
            <list-compon
                v-for="list in dataList"
                :key="list.record_id"
                :data="list"
                @list-click="listClick"
            ></list-compon>
        </template>
        <template
            v-else
        >
            <div class="empty-remind">當前無缺失紀錄需處理</div>
        </template>
    </div>
</full-size>
`;

var listTemp = /*html*/ `
<div
    class="one-list"
    @click="listClick"
>
    <div>
        <img
            :src="data.thumbnail || imgSrc"
        >
    </div>
    <div>
        <div>
            <div>
                <span>{{data.issue}}</span>
            </div>
            <div>
                <span>{{data.location}}</span>
                <span
                    v-if="data.mark"
                    class="mark-icon"
                >
                    <i aria-hidden="true" class="fa fa-map-marker"></i>
                </span>
            </div>
            <div
                v-if="data.checkitem"
            >
                <span>{{data.checkitem}}</span>
            </div>
        </div>
        <div
            class="select-icon"
        >
            <i 
                v-if="data.select"
                class="fa fa-check"
                aria-hidden="true"
            ></i>
        </div>
    </div>
</div>
`;

export { template, listTemp }