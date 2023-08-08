export default /*html*/ `
<div
    class="one-list"
>
    <div
        class="list-content"
        :class="{'danger': data.danger}"
    >
        <div
            v-if="data.type == 0"
            class="list-filp-icon"
            :class="{'filp-down': filpDown}"
            @click="filpClick"
        ></div>
        <div
            class="list-name"
        >
            <input
                type="text"
                v-model="data.name"
                placeholder="請輸入項目名稱"
                :readonly="!edit"
            >
        </div>
        <div
            class="list-option"
        >
            <div
                v-if="!edit"
                class="msg-btn hover-notice-dark"
                @click="tagClick"
                title-text="常用細項訊息設定"
            >
                <div></div>
            </div>
            <div
                v-if="edit"
                class="drap-icon"
            >
                <i class="fa fa-arrows-v" aria-hidden="true"></i>
            </div>
            <div
                v-if="edit"
                class="menu-btn"
                @click.stop="menuClick"
            >
                <div></div>
            </div>
            <template
                v-if="edit"
            >
                <div
                    class="list-menu"
                    v-show="isMine"
                >
                    <div
                        v-for="(list, index) in menu"
                        :key="index"
                        @click="list.fun"
                    >{{list.name}}</div>
                </div>
            </template>
        </div>
    </div>
    <template
        v-if="currentChild.length"
    >
        <transition name="filp">
            <draggable
                class="list-child"
                :class="{'on-drag': onDrag}"
                v-show="filpDown"
                :list="currentChild"
                drag-class="drag"
                ghost-class="ghost"
                handle=".drap-icon"
                @start="dragStart"
                @end="dragEnd"
            >
                <unit-compon
                    v-for="list in currentChild"
                    :key="list.keyIndex"
                    :data="list"
                    :menu-show="menuShow"
                    :level="level + 1"
                    :edit="edit"
                    @menu-click="onMenuClick"
                    @tag-click="onTagClick"
                    @new="onNew"
                    @trans="onTrans"
                    @delete="onDelete"
                    @on-drag-start="onDragStart"
                ></unit-compon>
            </draggable>
        </transition>
    </template>
</div>
`