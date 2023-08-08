export default /*html*/ `
<full-size
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnShow="nextBtnShow"
    @afterLeave="afterLeave"
>
    <div
        :class="{'loading': loading}"
    >
        <div>
            <div
                class="range-select"
            >
                <v-date-picker
                    v-model="range"
                    mode="date"
                    :masks="masks.range"
                    is-range
                >
                    <template
                        v-slot="{ inputValue, togglePopover, isDragging }"
                    >
                        <div
                            class="v-datepicker-area"
                        >
                            <i
                                class="fa fa-calendar" 
                                @click="togglePopover()"
                            ></i>
                            <input
                                :class="{'isDragging': isDragging}"
                                :value="inputValue.start"
                                readonly
                            />
                        </div>
                        <div>
                            <i class="fa fa-chevron-right" aria-hidden="true"></i>
                        </div>
                        <div
                            class="v-datepicker-area"
                        >
                            <input
                                :class="{'isDragging': isDragging}"
                                :value="inputValue.end"
                                readonly
                            />
                        </div>
                    </template>
                </v-date-picker>
            </div>
            <div
                class="project-select"
                v-if="!isProject"
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
        </div>
        <div>
            <div
                class="list-line-title list-line"
            >
                <div>檔案名稱</div>
                <div>建立人</div>
                <div>建立日期</div>
                <div></div>
            </div>
            <div
                class="scroll-style-gray-thick"
            >
                <div
                    class="list-line"
                    v-for="report in reportList"
                    :key="report.uid+report.time"
                >
                    <div>{{report.name}}</div>
                    <div>{{report.supervise}}</div>
                    <div>{{dateText(report.time)}}</div>
                    <div
                        @click="download(report)"
                    >
                        <div>
                            <i class="fa fa-download" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div
                    v-if="!reportList.length"
                    class="empty-remind"
                >無相關報告</div>
            </div>
        </div>
    </div>
</full-size>
`