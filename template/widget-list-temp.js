const cellElmTemp = /*html*/ `
<div
    class="cell-elm"
    :style="style"
    :content-type="this.options.type"
>{{text}}</div>
`

const colTemp = /*html*/ `
<div
    class="one-column"
>
    <div
        class="column-header"
        :class="'level' + level"
        :style="colHeaderStyle"
        @click="headerClick"
    >{{colTitleText}}</div>
    <div
        v-if="colInfo.children?.length > 0"
        class="sub"
    >
        <col-compon
            v-for="childId in colInfo.children"
            :key="childId"
            :colId="childId"
            :column-data="columnData"
            :data-obj="dataObj"
            :start="start"
            :end="end"
            :level="level + 1"
            :hover-index="hoverIndex"
            :col-unit-height="colUnitHeight"
            :scroll-top="scrollTop"
            @sort="childSort"
            @cellclick="childCellClick"
            @over="childOver"
            @leave="childLeave"
            @content-scroll="onContentScroll"
        ></col-compon>
    </div>
    <template
        v-else
    >
        <div 
            class="column-content"
            ref="content"
            @scroll="contentScroll($event)"
        >
            <div
                v-for="(celldata, index) in currentData"
                class="one-cell"
                :class="{'line-hover': index == hoverIndex}"
                :key="cellKeyIndex(index)"
                @click="cellClick(index)"
                @mouseover="mouseOver(index)"
                @mouseleave="mouseLeave"
            >
                <cell-elm-compon
                    v-for="(v, i) in celldata.data"
                    :key="i"
                    :data="v"
                    :options="cellStyleOptions[i]"
                ></cell-elm-compon>
            </div>
        </div>
    </template>
</div>
`

const template = /*html*/ `
<div
    class="widget-list-style"
    :class="{'loading': loading }"
    @click="showPageSelect = false"
>
    <div
        class="widget-list-header"
    >
        <div    
            class="date-range-area"
            v-if="withDate"
        >
            <template
                v-if="dateRange"
            >
                <v-date-picker
                    v-if="dateFormat == 'YYYY-MM-DD'"
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
            </template>
            <template
                v-else
            >
                <v-date-picker
                    v-if="dateFormat == 'YYYY-MM-DD'"
                    v-model="range.start"
                    mode="date"
                    :masks="masks.range"
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
                                :value="inputValue"
                                readonly
                            />
                        </div>
                    </template>
                </v-date-picker>
            </template>
        </div>
        <div 
            class="search-bar-area"
            v-if="keywordFilter"
        >
            <input
                type="text"
                v-model.trim.lazy="keyword"
                placeholder="輸入關鍵字搜尋"
            >
            <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div
            class="select-area"
            v-if="widgetOptions?.selectColumn?.length"
        >
            <div>
                <v-select
                    v-for="(id, index) in widgetOptions.selectColumn"
                    :key="id"
                    label="text"
                    :options="selectList(id)"
                    v-model="curSelectList[index]"
                    :reduce="type => type.id"
                    placeholder="點選或輸入搜尋"
                >
                    <template #no-options>沒有符合的項目</template>
                </v-select>
            </div>
        </div>
    </div>
    <div
        class="widget-list-content"
        @wheel.stop="contentWheel"
    >   
        <div
            class="scroll-style-gray-thick"
        > 
            <col-compon
                v-for="colId in col_order"
                :key="colId"
                :col-id="colId"
                :column-data="columnData"
                :data-obj="currentDataObj"
                :start="start"
                :end="end"
                :level="0"
                :total-level="totalLevel"
                :hover-index="hoverIndex"
                :col-unit-height="colUnitHeight"
                :scroll-top="contentScrollTop"
                @sort="onSortClick"
                @cellclick="onCellClick"
                @over="mouseOver"
                @leave="mouseLeave"
                @content-scroll="onContentScroll"
                ref="colCompon"
            ></col-compon>
        </div>
        <div
            class="content-scrollbar"
            @click="trackClick"
            :style="contentScrollTrackStyle"
            ref="contentScroll"
        >
            <div
                :style="contentScrollThumbStyle"
                @mousedown="thumbDown"
                @mouseup="thumbUp"
                @click.stop
            ></div>
        </div>
    </div>
    <div
        class="widget-list-bottom"
    >
        <div
            class="angle-btn"
            :class="{'active': hasForward}"
            @click="forwardClick"
        >
            <i class="fa fa-angle-left" aria-hidden="true"></i>
        </div>
        <div
            @click.stop="pageSelectClick($event)"
            class="page-select"
        >
            <div
                :class="{'show': showPageSelect}"
            >{{page + 1}}</div>
            <div
                :class="pageSelectClass"
            >
                <div
                    v-for="number in pageList"
                    :key="number"
                    @click="page = number"
                >{{number + 1}}</div>
            </div>
        </div>
        <div
            class="angle-btn"
            :class="{'active': hasNext}"
            @click="nextClick"
        >
            <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
    </div>
</div>
`

export { cellElmTemp, colTemp, template }