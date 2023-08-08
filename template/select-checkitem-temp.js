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
                    class="form-select"
                    @click="showSelect('form')"
                >   
                    <div>{{formText}}</div>
                    <div
                        class="triangle-icon"
                        :class="{'filp': miniSelectShow == 'form'}"
                    ></div>
                    <mini-select
                        v-show="miniSelectShow == 'form'"
                        :options="formType"
                        :label="'name'"
                        :withsearch="false"
                        :reduce="v => v.index"
                        :placeholder="'請選擇'"
                        @onselect="formSelect"
                    ></mini-select>
                </div>
                <div
                    class="group-select"
                    @click="showSelect('group')"
                >
                    <div>{{groupText}}</div>
                    <div
                        class="triangle-icon"
                        :class="{'filp': miniSelectShow == 'group'}"
                    ></div>
                    <mini-select
                        v-show="miniSelectShow == 'group'"
                        :options="groupList"
                        :withsearch="false"
                        @onselect="groupSelect"
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
            <template
                v-if="currentForm > 0"
            >
                <list-compon
                    v-for="list in listData"
                    :key="list.uid"
                    :select="currentSelect"
                    :data="list"
                    :level="0"
                    @on-list-click="listClick"
                ></list-compon>
            </template>
            <template
                v-else
            >
                <sh-list-compon
                    v-for="list in listData"
                    :key="list.keyIndex"
                    :select="currentSelect"
                    :data="list"
                    @on-list-click="shListClick"
                ></sh-list-compon>
            </template>
        </div>
    </div>
</float-dialog>
`;

var shListTemp = /*html*/ `
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

var listTemp = /*html*/ `
<div
    class="one-list"
>
    <div
        v-show="data.show"
        class="list-content"
        :listid="data.uid"
        :class="{'selected': data.uid == select}"
        @click.stop="listClick"
    >
        <div
            v-if="data.type == 0"
            class="list-filp-icon"
            :class="{'filp-down': filpDown}"
            @click.stop="filpClick"
        ></div>
        <div
            class="list-name"
        >{{data.name}}</div>
        <div
            class="list-select-icon"
        >
            <i 
                v-show="data.uid == select"
                class="fa fa-check" 
                aria-hidden="true"
            ></i>
        </div>
    </div>
    <template
        v-if="data.child.length"
    >
        <transition name="filp">
            <div
                class="list-child"
                v-show="filpDown"
            >
                <list-compon
                    v-for="list in data.child"
                    v-show="list.show"
                    :key="list.uid"
                    :data="list"
                    :select="select"
                    :level="level + 1"
                    @on-list-click="onListClick"
                ></list-compon>
            </div>
        </transition>
    </template>
    </div>
</div>
`;

export {mainTemplate, shListTemp, listTemp};