export default /*html*/ `
<full-size
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnShow="nextBtnShow"
    :nextBtnText="nextBtnText"
    @nextBtnClick="nextBtnClick"
    @close="closeClick"
    @afterLeave="afterLeave"
    ref="dialog"
>
    <div
        :class="{'loading': loading}"
        @click="pageClick"
    >
        <div
            class="edit-tag-header"
        >
            <div>
                <span>檢查項目：</span>
                <span>{{name}}</span>
            </div>
            <div>
                <div
                    class="tab-option"
                    :class="{'active' : currentTab == index}"
                    v-for="(tab, index) in tabs"
                    :key="index"
                    @click.stop="tabClick(index)"
                >{{tab}}</div>
            </div>
        </div>
        <div
            class="edit-tag-content"
        >
            <div
                v-for="(tag, index) in currentTag"
            >
                <div
                    class="one-tag"
                    :class="{'edit': tag.edit, 'danger': tag.danger}"
                    @click="tagClick(tag)"
                >
                    <div>
                        <input
                            type="text"
                            v-model.trim="tag.name"
                            placeholder="輸入細項內容"
                            :readonly="!edit && !tag.edit"
                        >
                    </div>
                    <div
                        v-if="edit"
                        @click.stop="rightBtnClick(tag, index)"
                    >
                        <i 
                            class="fa fa-check"
                            v-if="tag.edit"
                        ></i>
                        <i 
                            class="fa fa-times"
                            v-if="!tag.edit"    
                        ></i>
                    </div>
                </div>
            </div>
            <div
                v-if="!currentTag.length && !edit"
            >
                <div
                    class="empty-remind"
                >尚無建立細項訊息</div>
            </div>
            <div
                class="new-tag"
                btn-type="newTagType"
                v-if="edit"
            >
                <div
                    class="new-tag-btn"
                    @click.stop="newTagClick"
                    v-if="showAddBtn"
                >新增細項說明</div>
                <div
                    class="one-tag edit"
                    v-if="!showAddBtn"
                    :class="{'danger': newTagData.danger}"
                    @click.stop
                >
                    <div>
                        <input
                            type="text"
                            v-model.trim="newTagData.name"
                            placeholder="輸入細項內容"
                        >
                    </div>
                    <div
                        @click.stop="addTagClick"
                    >
                        <i class="fa fa-check"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</full-size>
`