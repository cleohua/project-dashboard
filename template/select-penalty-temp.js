var mainTemplate = /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :bottomShow="bottomShow"
    :showCloseBtn="showCloseBtn"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <div
        :class="{'loading': loading}"
    >
        <div>
            <div>
                <div
                    class="type-select"
                    @click="miniSelectShow = !miniSelectShow"
                >
                    <div>{{typeText}}</div>
                    <div
                        class="triangle-icon"
                        :class="{'filp': miniSelectShow}"
                    ></div>
                    <mini-select
                        v-show="miniSelectShow"
                        :options="typeList"
                        :withsearch="false"
                        @onselect="typeSelect"
                    ></mini-select>
                </div>
            </div>
            <div>
                <i class="fa fa-search" aria-hidden="true"></i>
                <input
                    type="text"
                    v-model.trim="searchText"
                    placeholder="請輸入關鍵字"
                >
            </div>
        </div>
        <div
            class="scroll-style-gray-thick"
        >
            <list-compon
                v-for="list in listData"
                :key="list.keyIndex"
                :select="selectID"
                :data="list"
                @onlistclick="listClick"
            ></list-compon>
        </div>
    </div>
</float-dialog>
`

var listTemp = /*html*/ `
<div
    class="one-unit"
    v-show="data.show"
>
    <div>{{data.typeName}}</div>
    <div>
        <template
            v-if="data.list.length"
        >
            <template
                v-if="childList.length"
            >
                <div
                    v-for="l in childList"
                    :key="l.uid"
                    class="list-content"
                    :class="{'selected': l.uid == select}"
                    @click="listClick(l)"
                >
                    <div
                        class="list-name"
                    >{{l.name}}</div>
                    <div
                        class="list-fine-text"
                    >{{fineText(l.fine)}}</div>
                    <div
                        class="list-select-icon"
                    >
                        <i 
                            v-show="l.uid == select"
                            class="fa fa-check" 
                            aria-hidden="true"
                        ></i>
                    </div>
                </div>
            </template>
            <template
                v-else
            >
                <div
                    class="empty-remind"
                >無符合項目</div>
            </template>
        </template>
        <template
            v-else
        >
            <div
                class="empty-remind"
            >無項目</div>
        </template>
    </div>
</div>
`;

export { mainTemplate, listTemp };
