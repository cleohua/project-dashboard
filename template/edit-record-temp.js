export default `
<full-dialog
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnShow="nextBtnShow"
    :nextBtnText="nextBtnText"
    :nextBtnClassArr="nextBtnClassArr"
    :returnBtnText="returnBtnText"
    :subMenu="subMenu"
    :subMenuArr="subMenuOption"
    :emitSubMenuEvent="emitSubMenuEvent"
    @nextBtnClick="nextBtnClick"
    @close="closeClick"
    @subMenuClick="subMenuClick"
    ref="dialog"
>
    <template
        v-if="this.status > 0"
        v-slot:header-right="{
            subMenuArr,
            subMenuClick,
        }"
    >
        <div
            v-for="(btn, index) in subMenuArr"
            @click="subMenuClick(index)"
            class="style-btn"
            :class="btn?.class || ''"
        >{{btn.text}}</div>  
    </template>
    <template
        v-slot:default
    >
        <div
            :class="{'loading': loading}"
            @wheel.stop.prevent="pageWheel"
        >
            <div
                class="paper-header"
                :class="{'flip-up': paperHeaderHide}"
            >
                <div
                    class="header-left"
                >
                    <div>
                        <div>{{paperInfo.name}}</div>
                    </div>
                    <div>
                        <div>
                            <span>督導日期：</span>
                            <span>{{paperInfo.date}}</span>
                        </div>
                        <div>
                            <span>工處別：</span>
                            <span>{{paperInfo.office || '無指定'}}</span>
                        </div>
                        <div>
                            <span>工地：</span>
                            <span>{{paperInfo.project.name}}</span>
                        </div>
                        <div
                            v-if="showExamine"
                            class="show-examine-btn"
                            @click="showExamineRecord = !showExamineRecord"
                        >
                            <span>檢視辦況紀錄</span>
                            <i 
                                aria-hidden="true"
                                class="fa fa-angle-down"
                                :class="{'fa-rotate-180': showExamineRecord}"
                            ></i>
                        </div>
                    </div>
                </div>
                <div
                    class="header-right"
                >
                    <div>
                        <span>督導人員：</span>
                        <span>{{paperInfo.user.name}}</span>
                    </div>
                </div>
            </div>
            <div
                class="paper-content"
            >
                <div 
                    class="changetabs"
                    v-if="showChangeTabs"
                >
                    <div
                        class="changetabs-option"
                        :class="changeTabClass(tab)"
                        v-for="(tab, i) in curChangeTab"
                        :key="tab.index"
                        @click="changeTabsClick(tab.index)"
                    >
                        <span
                            :class="{'hover-notice-dark': tab.hoverText.length}"
                            :title-text="tab.hoverText"
                        >{{tab.text}}</span>
                        <i
                            class="fa fa-angle-right"
                            aria-hidden="true"
                            v-if="i < curChangeTab.length - 1"
                        ></i>
                    </div>
                </div>
                <div
                    class="flex-1-overhide"
                >
                    <div
                        class="record-card-content"
                        ref="recordContent"
                    >
                        <template
                            v-if="showRecordCard"
                        >
                            <record-card
                                v-for="(card, index) in cardList"
                                :key="card.keyIndex"
                                :editable="editable && !isProject"
                                :keyIndex="card.keyIndex"
                                :data="card"
                                ref="card"
                                @select="select(index, $event)"
                                @delete-card="deleteCard"
                                @dupicate="dupicate"
                            ></record-card>
                        </template>
                        <template
                            v-if="showImproveCard"
                        >
                            <improve-card
                                :editable="editable"
                                :mini-date="cardList?.[0].time"
                                :improve="improveData"
                                :tab-index="currentChangeTab"
                                :allow-remove="allowImproveCardRemove"
                                ref="improveCard"
                                @improve-select="improveSelect"
                                @delete-card="deleteImportCard"
                            ></improve-card>
                        </template>
                        <div
                            v-if="showAddRecordBtn"
                            class="add-record-btn"
                            @click="newCard"
                        >
                            <div>+</div>
                            <div>新增記錄</div>
                        </div>
                    </div>
                </div>
                <transition
                    name="slide"
                    appear
                >
                    <examine-record
                        v-if="showExamineRecord"
                        :historyList="examineHistory.history"
                        :examineFlow="examineHistory.flow"
                    ></examine-record>
                </transition>
            </div>
        </div>
    </template>
</full-dialog>
`