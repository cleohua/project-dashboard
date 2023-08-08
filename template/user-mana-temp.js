export default /*html*/ `
<full-dialog
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnShow="nextBtnShow"
    @afterLeave="afterLeave"
>
    <div
        :class="{'loading': loading}"
        @click="tabShow = null"
    >
        <div
            v-for="oneGroup in groupList"
            :key="oneGroup.level"
            class="one-group"
        >
            <div>
                <div>
                    <div>{{oneGroup.name}}</div>
                    <div
                        v-if="oneGroup.hints"
                        class="text-hints hover-notice-dark"
                        :title-text="oneGroup.hints"
                    >?</div>
                </div> 
                <div
                    v-if="showAddBtn(oneGroup)"
                    class="new-user-btn"
                    @click="newUser(oneGroup)"
                >新增人員</div>
                <div
                    v-else-if="editable(oneGroup.level)"
                    class="limit-remind-text"
                >已達上限</div>
            </div>
            <div>
                <div
                    v-for="user in oneGroup.executor"
                    class="one-user"
                >
                    <div
                    >
                        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                    </div>
                    <div
                    >
                        <div>{{user.name}}</div>
                        <div
                            v-if="jobTitleText(user.role_id, oneGroup)"
                            class="job-type-text"
                        >{{jobTitleText(user.role_id, oneGroup)}}</div>
                        <div
                            v-if="user.text"
                            class="notific-text"
                            v-html="user.text"
                        ></div>
                    </div>
                    <div
                        class="list-option"
                    >
                        <div
                            class="menu-btn"
                            @click.stop="menuClick(user.uid)"
                        >
                            <div></div>
                        </div>
                        <div
                            class="list-menu"
                            v-show="user.uid == tabShow"
                        >
                            <div
                                v-if="showNotificOption"
                            >
                                <div
                                    class="list-menu-option"
                                    v-if="user.notification == 1"
                                    @click="notifiClick(user.uid)"
                                >設為辦理</div>
                                <div
                                    class="list-menu-option"
                                    v-if="user.notification == 0"
                                    @click="notifiClick(user.uid)"
                                >設為知會</div>
                            </div>
                            <div
                                class="list-menu-option"
                                @click="userChange(user)"
                                v-if="editable(oneGroup.level)"
                            >更換人員</div>
                            <div
                                class="list-menu-option"
                                @click="logClick(user.uid)"
                            >修改記錄</div>
                            <div
                                class="list-menu-option"
                                v-if="deletable(user.role_id, oneGroup)"
                                @click="deleteUser(user.uid)"
                            >刪除人員</div>
                        </div>
                    </div>
                </div>
                <div
                        v-if="!oneGroup.executor.length"
                        class="empty-remind"
                >尚未設定</div>
            </div>
        </div>
    </div>
</full-dialog>
`