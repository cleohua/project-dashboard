var slotContent = /*html*/ `
<div
    :class="{'loading': loading}"
    @click.stop="pageClick"
>
    <div>{{name}}</div>
    <div>
        <div
            class="mouse-pointer"
            @click.stop="showSelect('office')"
            v-if=false
        >
            <div>工處別</div>
            <div
                class=""
            >
                <div>{{officeText}}</div>
                <div
                    class="triangle-icon"
                    :class="{'filp': miniSelectShow == 'office'}"
                ></div>
            </div>
            <mini-select
                v-show="miniSelectShow == 'office'"
                :options="officeList"
                :withsearch="true"
                @onselect="officeSelect"
            ></mini-select>
        </div>
        <div
            class="mouse-pointer"
            :class="{'danger': danger.project}"
            @click.stop="showSelect('project')"
        >
            <div>工地名稱</div>
            <div>
                <div>{{projectText}}</div>
                <div
                    class="triangle-icon"
                    :class="{'filp': miniSelectShow == 'project'}"
                ></div>
            </div>
            <mini-select
                v-show="miniSelectShow == 'project'"
                :options="projectList"
                :withsearch="true"
                @onselect="projectSelect"
            ></mini-select>
        </div>
        <div
            class="mouse-pointer"
            :class="{'danger': danger.checker}"
            @click="addChecker"
        >
            <div>會驗人員</div>
            <div
                class=""
            >
                <div>{{checkerText}}</div>
                <div
                    class="user-icon"
                >
                    <i class="fa fa-user"></i>
                </div>
            </div>
        </div>
        <div
            class="mouse-pointer"
            @click.stop="showSelect('type')"
        >
            <div>業務類型</div>
            <div
                class=""
            >
                <div>{{typeText}}</div>
                <div
                    class="triangle-icon"
                    :class="{'filp': miniSelectShow == 'type'}"
                ></div>
            </div>
            <mini-select
                v-show="miniSelectShow == 'type'"
                :options="typeList"
                :withsearch="false"
                @onselect="typeSelect"
            ></mini-select>
        </div>
        <div>
            <div>督導人員</div>
            <div>
                <div>{{userName}}</div>
            </div>
        </div>
        <div>
            <div>督導日期</div>
            <div>
                <v-date-picker 
                    mode="date" 
                    v-model="date"
                    :masks="masks"
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
        </div>
    </div>
</div>
`

export default /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    @afterLeave="afterLeave"
    ref="dialog"
>${slotContent}</float-dialog>
`