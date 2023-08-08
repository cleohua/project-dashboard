export default /*html*/ `
<div
    class="workspace-area"
    :class="{'loading': loading}"
>
    <div
        class="header"
        :class="{'flip': headerflipup}"
    >
        <transition
            name="haeder-content"
        >
            <div
                class="header-content"
                v-show="!headerflipup"
            >
                <div>
                    <div
                        class="setting-btn-area"
                        :class="{'optionShow': optionShow}"
                    >
                        <div
                            id="setting"
                            class="setting-icon active hover-notice-dark"
                            @click="optionShow = !optionShow"
                            title-text="更多"
                        >
                            <div></div>
                        </div>
                        <div
                            v-show="optionShow"
                        >
                            <div
                                v-for="(btn, index) in settingOption.filter(i => i.show)"
                                :id="btn.id"
                                class="setting-icon hover-notice-light"
                                @click="btn.funCall"
                                :title-text="btn.titleText"
                            ></div>
                        </div>
                    </div>
                    <div
                        class="workspace-tab"
                        v-if="showWorkspaceTab"
                    >
                        <div
                            v-for="(text, index) in workspaceTab"
                            @click="workspaceTabClick(index)"
                            :class="{'active': currentWorkspaceTab == index}"
                        >{{text}}</div>
                    </div>
                    <div
                        class="auditspace-tab"
                        v-if="isAuditTab"
                    >
                         <div
                            v-for="(text, index) in paperTab"
                            @click="paperTabClick(index)"
                            :class="{'active': currentPaperTab == index}"
                        >{{text}}</div>
                    </div> 
                    <div
                        class="auditoption-tab"
                        v-if="isAuditTab"
                    >
                        <div
                            :class="{'active': currentRecordTab == index}"
                            v-for="(text, index) in recordTab"
                            @click="recordTabClick(index)"
                        >{{text}}</div>
                    </div>
                    <div class="audit-option">
                        <div
                            class="report-select"
                            v-show="showReportTypeSelect"
                        >
                            <v-select
                                label="name"
                                :options="reportSelectOption"
                                v-model="currentReportType"
                                placeholder="所有報告類型"
                                :reduce="type => type.index"
                            >
                            </v-select>
                        </div>
                        <div
                            class="status-select"
                            v-show="showReportTypeSelect"
                        >
                            <v-select
                                label="name"
                                :options="statusOption"
                                v-model="currentStatus"
                                placeholder="所有狀態類型"
                                :reduce="type => type.index"
                            >
                            </v-select>
                        </div>
                    </div>
                    <div
                        class="type-select"
                        v-if="showTypeSelect"
                    >
                        <div
                            class="type-option"
                            :class="{'active': currentStatus == type.index}"
                            v-for="type in statusTab"
                            :key="type.index"
                            @click="typeClick(type.index)"
                        >{{type.name}}</div>
                    </div>
                </div>
                <div
                    class="range-select"
                >
                    <v-date-picker
                        v-model="range"
                        mode="date"
                        :masks="masks.range"
                        :columns="$screens({ default: 1, lg: 2 })"
                        is-range
                    >
                        <template
                            v-slot="{inputEvents, inputValue, isDragging }"
                        >
                            <div
                                class="v-datepicker-area"
                            >
                                <i
                                    class="fa fa-calendar" 
                                    v-on="inputEvents.start"
                                ></i>
                                <input
                                    :value="inputValue.start"
                                    v-if="inputValue.start"
                                    readonly
                                />
                            </div>
                            <div
                                v-if="inputValue.start"
                                style="margin: 0 2px;"
                            >
                                <i
                                    class="fa fa-chevron-right"
                                    aria-hidden="true"
                                    style="font-size: 15px; position: relative; top: -1px;"
                                ></i>
                            </div>
                            <div
                                class="v-datepicker-area"
                            >
                                <input
                                    :value="inputValue.end"
                                    v-show="inputValue.end"
                                    readonly
                                />
                            </div>
                            <div
                                v-if="!inputValue.start"
                                class="remind-text"
                            >日期範圍</div>
                            <div
                                class="close-btn"
                                @click="removeRangeSelect"
                                v-if="inputValue.start"
                            >
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </div>
                        </template>
                    </v-date-picker>
                </div>
                <div
                    class="project-select"
                    v-if="!isproject"
                >
                    <v-select
                        label="text"
                        :options="paginated_0"
                        :filterable="false"
                        v-model="currentProjcet"
                        @open="vSelectOnOpen(0)"
                        @close="vSelectOnClose(0)"
                        @search="query => porjectText = query"
                        placeholder="所有工地"
                    >
                        <template #list-footer>
                            <li
                                ref="load"
                                class="loader"
                                v-show="load_0"
                            >顯示更多</li>
                        </template>
                        <template #no-options>沒有符合的項目</template>
                    </v-select>
                </div>
                <div
                    class="supervise-select"
                    v-show="showSuperviseSelect"
                >
                    <v-select
                        label="name"
                        :options="paginated_1"
                        :filterable="false"
                        v-model="currrentSupervise"
                        @open="vSelectOnOpen(1)"
                        @close="vSelectOnClose(1)"
                        @search="query => supserviseText = query"
                        placeholder="所有督導人員"
                    >
                        <template #list-footer>
                            <li
                                ref="load"
                                class="loader"
                                v-show="load_1"
                            >顯示更多</li>
                        </template>
                        <template #no-options>沒有符合的項目</template>
                    </v-select>
                </div>
                <div
                    class="user-select"
                    v-if="showPrincipalSelect"
                >
                    <v-select
                        label="name"
                        :options="paginated_2"
                        :filterable="false"
                        v-model="currentUser"
                        @open="vSelectOnOpen(2)"
                        @close="vSelectOnClose(2)"
                        @search="query => userText = query"
                        placeholder="搜尋缺失改善人員"
                    >
                        <template #list-footer>
                            <li
                                ref="load"
                                class="loader"
                                v-show="load_2"
                            >顯示更多</li>
                        </template>
                        <template #no-options>沒有符合的項目</template>
                    </v-select>
                </div>
            </div>
        </transition>
        <div
            class="header-flip-btn hover-notice-dark"
            :title-text="headerflipBtnText"
            @click="onflipBtnClick"
        >
            <i 
                class="fa fa-angle-up"
                :class="{'fa-rotate-180': headerflipup}"
                aria-hidden="true"
            ></i>
        </div>
    </div>
    <div
        class="content"
        ref="content"
    >
        <div
            v-if="dataList.length == 0"
            class="empty-remind"
        >尚無任何走動管理記錄</div>
        <template
            v-if="showReportCard"
        >
            <report-card
                v-for="list in dataList"
                :key="list.record_id"
                :data="list"
                :options="listOptions"
                :isproject="isproject"
                @onreportclick="reportClick"
                @onmarkclick="markClick"
            ></report-card>
            <div    
                ref="pageload"
                class="read-more"
                v-if="showPageLoad"
            >readmore</div>
        </template>
        <template
            v-if="showPaperCard"
        >
            <paper-card
                v-for="list in dataList"
                :data="list"
                :key="list.uid"
                :options="paperOptions"
                :isproject="isproject"
                @onpaperClick="paperClick"
                @onrecordview="onRecordView"
             ></paper-card>
            <div    
                ref="pageload"
                class="read-more"
                v-if="showPageLoad"
            >readmore</div>
        </template>
    </div>
</div>
`