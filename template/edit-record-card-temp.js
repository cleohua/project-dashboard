export default /*html*/ `
<div
    class="one-record-card"
    :class="{'editable': editable}"
>
    <div>
        <div
            class="picture-area"
        >
            <template
                v-if="data.pictureList.length"
            >
                <div
                    v-if="data.pictureList.length > 1"
                    class="prev-btn change-btn"
                    :class="{'active': currentPict > 0}"
                    @click="prevPictClick"
                ></div>
                <div
                    class="pict-content"
                >
                    <img
                        :src="imgSrc"
                    >
                </div>
                <div
                    v-if="data.pictureList.length > 1"
                    class="next-btn change-btn"
                    :class="{'active': currentPict < (data.pictureList.length - 1)}"
                    @click="nextPictClick"
                ></div>
                <div
                    class="count-text"
                >{{countText}}</div>
                <div
                    v-if="editable"
                    class="pict-options"
                    @click="pictMenuClick"
                >
                    <div
                        class="hover-notice-dark"
                        title-text="更多"
                    >
                        <div></div>
                    </div>
                    <div
                        class="pict-menu"
                        v-show="pictMenuShow"
                    >
                        <div
                            @click="addPictClick"
                        >新增照片</div>
                        <div
                            @click="selectPictClick"
                        >變更照片</div>
                        <div
                            @click="editPictClick"
                        >編輯照片</div>
                        <div
                            @click.stop="deletePictClick"
                        >刪除照片</div>
                    </div>
                </div>
            </template>
            <template
                v-else-if="editable"
            >
                <div
                    class="add-pict-btn"
                    :class="{'danger': danger.picture}"
                    @click="addPictClick"
                >
                    <div>+</div>
                    <div
                        v-if="danger.picture == true"
                    >請新增照片</div>
                </div>
            </template>
            <template
                v-else
            >
                <div
                    class="pict-content"
                >
                    <img
                        style="filter: contrast(150%); height: 70%;"
                        src="./include/images/safety-inspect/image-icon.svg"
                    >
                </div> 
            </template>
        </div>
        <div
            class="report-type-area"
        >
            <div
                v-for="type in reportTypeList"
                :key="type.index"
                :data-type="type.index"
                @click="reportTypeClick(type.index)"
                :class="{'active': data.reportType == type.index, 'mouse-pointer': editable}"
            >{{type.name}}</div>
        </div>
        <div
            class="form-area"
        >
            <div
                class="form-table"
                form-type="location"
            >
                <div>{{locateTitle}}</div>
                <div>
                    <div>    
                        <input
                            type="text"
                            v-model.trim="data.location"
                            placeholder="請輸入位置"
                            :readonly="!editable"
                        >
                    </div>
                    <div
                        title-text="底圖標定"
                        class="hover-notice-light"
                        :class="locateClass"
                        @click="selectClick('location')"
                    >
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div
                v-if="data.reportType < 4"
                class="form-table"
                :class="{'danger': danger.checkitem, 'mouse-pointer': editable}"
                form-type="checkitem"
                @click="selectClick('checkitem')"
            >
                <div>檢查項目</div>
                <div>{{checkItemText}}</div>
            </div>
            <div
                class="form-table"
                :class="{'danger': danger.context, 'big': data.reportType == 4}"
                form-type="context"
            >
                <div>{{contextTitle}}</div>
                <div>
                    <textarea
                        class="scroll-style-gray-thin"
                        v-model="data.context"
                        placeholder="補充說明"
                        :readonly="!editable"
                    ></textarea>
                </div>
                <div
                    v-if="data.reportType < 4 && data.checkitem && currentTagList.length"
                    class="tag-area"
                >
                    <div>常用細項訊息</div>
                    <div>
                        <div
                            v-for="tag in currentTagList"
                            :key="tag.uid"
                            :class="{'active': tag.active, 'mouse-pointer': editable}"
                            @click="tagClick(tag)"
                        >{{tag.name}}</div>
                    </div>
                </div>
            </div>
            <div
                v-if="data.reportType == 2 || data.reportType == 3"
                class="form-table"
                form-type="worktypetext"
            >
                <div>工項別</div>
                <div>
                    <input
                        type="text"
                        v-model.trim="data.workTypeText"
                        placeholder=""
                        :readonly="!editable"
                    >
                </div>
            </div>
            <div
                v-if="data.reportType == 1 && data.checkitem"
                class="form-table "
                :class="{'danger': danger.reason, 'mouse-pointer': editable}"
                form-type="reason"
                @click="selectClick('reason')"
            >
                <div>缺失原因</div>
                <div>{{reasonText}}</div>
            </div>
            <div
                v-if="showDangerTable"
                class="form-table"
                :class="{'danger': danger.dangerType, 'mouse-pointer': editable}"
                form-type="dangertype"
                @click="selectClick('danger')"
            >
                <div>危害類型</div>
                <div>{{dangerTypeText}}</div>
            </div>
        </div>
        <div
            class="form-area"
            v-if="data.reportType == 1"
        >
            <div
                class="form-table"
                form-type="time"
            >
                <div>查核日期</div>
                <div
                    v-if="editable"
                >
                    <v-date-picker 
                        mode="date" 
                        v-model="data.time"
                        :masks="masks"
                        :max-date="data.endTime"
                        color="yellow"
                    >
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                                class="date-input"
                                :value="inputValue"
                                v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                </div>
                <div
                    v-else
                >
                    <input
                        class="date-input"
                        mode="text"
                        v-model="data.time"
                        :readonly="true"
                    >
                </div>
            </div>
            <div
                class="form-table"
                form-type="endtime"
            >
                <div>回覆日期</div>
                <div
                    v-if="editable"
                >
                    <v-date-picker 
                        mode="date" 
                        v-model="data.endTime"
                        :masks="masks"
                        :min-date="data.time"
                        :update-on-input="false"
                        color="yellow"
                    >
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                                class="date-input"
                                :value="inputValue"
                                v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                </div>
                <div
                    v-else
                >
                    <input
                        class="date-input"
                        mode="text"
                        v-model="data.endTime"
                        :readonly="true"
                    >
                </div>
            </div>
            <div
                class="form-table"
                form-type="checker"
            >
                <div>會驗人員</div>
                <div
                    :class="{'hover-notice-light': data.checkerName.length}"
                    :title-text="checkerHoverText"
                >
                    <div>{{checkerText}}</div>
                </div>
            </div>
            <div
                class="form-table"
                :class="{'mouse-pointer': editable}"
                form-type="engineer"
                @click="selectClick('engineer')"
            >
                <div>責任工程師</div>
                <div
                    :class="{'hover-notice-light': data.engineer.length}"
                    :title-text="engineerHoverText"
                >
                    <div>{{engineerText}}</div>
                </div>
            </div>
        </div>
        <div
            v-if="data.reportType == 1"
            class="form-area"
        >
            <div
                class="form-table"
                :class="{'mouse-pointer': editable}"
                form-type="work"
                @click="selectClick('work')"
            >
                <div>缺失工項</div>
                <div>{{workText}}</div>
            </div>
            <div
                class="form-table"
                :class="{'mouse-pointer': editable}"
                form-type="company"
                @click="selectClick('company')"
            >
                <div>缺失廠商</div>
                <div>{{companyText}}</div>
            </div>
            <div
                class="form-table"
                :class="{'mouse-pointer': editable}"
                form-type="penalty"
                @click="selectClick('penalty')"
            >
                <div>罰鍰條款</div>
                <div>{{penaltyText}}</div>
            </div>
            <div
                v-if="data.penalty != null && Object.keys(data.penalty).length"
                class="form-table"
                :class="{'danger': danger.fine}"
                form-type="fine"
            >
                <div>罰款金額</div>
                <div>
                    <input
                        type="text"
                        v-model="data.fine"
                        @input="onlyNumber"
                        :placeholder="fineInputHolderText"
                        :readonly="!editable"
                    >
                </div>
                <div>(新台幣)</div>
            </div>
        </div>
    </div>
    <div
        class="card-options"
        v-if="editable"
    >
        <div
            v-if="data.allowRemove"
            class="card-delete-btn hover-notice-dark"
            title-text="移除紀錄"
            @click="remove"
        >
            <div>+</div>
        </div>
        <div
            v-if="data.allowDupicate"
            class="card-dupicate-btn hover-notice-dark"
            title-text="複製紀錄"
            @click="dupicate"
        >
            <div></div>
        </div>
    </div>
</div>
`