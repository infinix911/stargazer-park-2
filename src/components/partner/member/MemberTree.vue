<template>
	<div class="flex-row-fluid mb-1em px-4 tree-content pb-4">
			<div class="row mb-6 d-flex">
			<button class="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 m-2 treeBtn" @click="getMembersTree(true)">
					<i class="fas fa-expand mr-1 text-sm" /> {{ $t("openAll") }}
			</button>
			<button
					class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg font-medium transition-all duration-200 hover:scale-105 m-2 treeBtn"
					@click="getMembersTree(false)"
			>
					<i class="fas fa-compress mr-1 text-sm" /> {{ $t("closeAll") }}
			</button>
			</div>
			<div class="row g-5 g-xl-12 tree">
			<Tree
					:nodes="treeData"
					:use-icon="true"
					:use-checkbox="true"
					row-hover-background="true"
			>
					<template #iconActive>
					<i class="fas fa-plus text-white bg-blue-500 arrow"></i>
					</template>
					<template #iconInactive>
					<i class="fas fa-minus text-white bg-blue-500 arrow"></i>
					</template>
					<template #checkbox="{ node }">
					<div class="whitespace-nowrap">
						<slot> <i class="fa fa-folder mr-1 text-yellow-400 text-sm"></i></slot>
						<span class="mr-1 text-sm">{{
								getMemberClass((node as any as ITreeViewItem).depth)
						}}</span>
						<span class="mr-1 text-sm">
								/ {{ (node as any as ITreeViewItem).label }}</span
						>
						<span class="mr-1 text-sm">
								/ {{ (node as any as ITreeViewItem).userlabel }}</span
						>
						<span class="mr-1 text-sm"> / {{ (node as any as ITreeViewItem).member_count }} 명</span>
					</div>
					<span class="mx-1" v-if="node.status">
						<span class="badge badge-info text-sm" v-if="node.status === 0">
							{{ $t("status.new") }}
						</span>
						<span class="badge badge-warning text-sm" v-else-if="node.status == 1">
							{{ $t("status.waiting") }}
						</span>
						<span class="badge badge-primary text-sm" v-else-if="node.status === 2">
							{{ $t("status.normal") }}
						</span>
						<span class="badge badge-danger text-sm" v-else>
							{{ $t("status.stopped") }}
						</span>
                	</span>						
					</template>
			</Tree>
			</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Tree from "vue3-tree";
import "vue3-tree/dist/style.css";
import ApiService from "@/services/ApiService";

interface ITreeViewItem {
	id: string;
	userlabel: number;
	label: number;
	depth: number;
	upper_id: string;
	member_count: number;
	nodes: ITreeViewItem[];
	expanded: boolean;
	status: number;
}

export default defineComponent({
	name: "MemberTree",
	components: {
		Tree,
	},
	setup() {
		// vue variables
		const { t } = useI18n();
		const agentID = ref("");
		const treeData: any = ref<Array<ITreeViewItem>>([]);

		const isOpenTree = ref(false);
		/**
		 * Get Agents Tree
		 *
		 */
		const getMembersTree = async (isOpen) => {
		// add data
		isOpenTree.value = isOpen;
		const results = await ApiService.get("/partner/member/tree")
				.then((res) => res.data)
				.catch(() => []);
		eachRecursive(results, isOpen, false, null);
		};

		const eachRecursive = (
		t: any,
		isOpen = false,
		isCallApi = false,
		node: any
		) => {
		let obj = t;
		for (let a1 = 0; a1 < obj.length; a1 += 1) {
				if (isCallApi && node) {
				if (obj[a1].id === node.id) {
						setTimeout(() => {
						obj[a1].expanded = !isOpenTree.value
								? isCallApi
								? !node.expanded
								: false
								: true;
						}, 0);
				}
				} else {
				obj[a1].expanded = isOpen;
				}
				// Recursive
				if (Object.keys(obj[a1]).includes("nodes")) {
				eachRecursive(obj[a1].nodes, isOpen, isCallApi, node);
				}
		}
		treeData.value = obj;
		};

		const getMemberClass = (depth) => {
		return t("partner.parent" + depth);
		};

		/**
		 * On Mounted
		 *
		 */
		onMounted(() => {
				getMembersTree(true);
		});

		return {
		// Members Tree data
		treeData,
		// Members Tree
		getMemberClass,
		getMembersTree,
		// variables
		agentID,
		};
	},
});
</script>

<style>
.selected-tree-item {
	background: rgba(250, 250, 250, 0.795);
	color: white;
}

ul {
	padding-left: 0;
	margin: 0;
	list-style-type: none;
	display: inline-block;
}

li {
	border-radius: 4px;
}

li.drag-over {
	background-color: rgba(22, 22, 22, 0.068);
}

.tree-view-item {
	margin: 0.1em;
	padding: 0.35em;
}

.chevron-right {
	color: gray;
}

.hide-chevron {
	visibility: collapse;
}

.icon-area {
	width: 22px;
	margin-right: 0.4em;
}

.horizontal-dashes {
	width: 1em;
	border-top: 1px dashed rgb(192, 192, 192);
}

.node-name {
	cursor: pointer;
	margin-left: 5px;
}

.d-flex {
	display: flex;
}

.align-items-center {
	align-items: center;
}

.node-child {
	margin-left: 37px !important;
	border-left: 1px dashed rgb(192, 192, 192);
	display: block;
}

.hide {
	display: none;
}

.hide-guidelines {
	border-left: none !important;
}

.chevron-right {
	box-sizing: border-box;
	position: relative;
	display: block;
	transform: scale(var(--ggs, 1));
	width: 22px;
	height: 22px;
	border: 2px solid transparent;
	border-radius: 100px;
	transition: 0.2s;
}

.pointer {
	cursor: pointer;
}

.chevron-right.rotate-90::after {
	transform: rotateZ(45deg);
}

.chevron-right::after {
	content: "";
	display: block;
	box-sizing: border-box;
	position: absolute;
	width: 7px;
	height: 7px;
	border-bottom: 2px solid;
	border-right: 2px solid;
	transform: rotate(-45deg);
	right: 6px;
	top: 5px;
}

.tree-row-txt {
	margin-left: 25px;
	display: none !important;
}

.tree-row-item {
	border-bottom: 1px dotted rgba(191, 191, 191, 0.3) !important;
}


.tree-row-item:hover:before {
	background-color: #80808085 !important;
}

.agent-tree {
	padding-left: 1rem;
	padding-right: 1rem;
}

.tree-row {
	cursor: pointer;
}

.folder {
	margin-right: 0px;
}

.arrow {
	border: 1px solid #3b82f6;
	border-radius: 4px;
	margin-right: 10px;
	padding: 4px 6px;
	font-size: 12px;
	font-weight: bold;
}

.mr-1rem {
	margin-right: 0.5rem;
}

.open-member {
	height: 2em;
	font-size: 1em;
	line-height: 0;
	width: 3em;
	margin: 0 !important;
	padding: 0.1em !important;
	margin-left: 0.2em !important;
}

.treeBtn {
	flex: 30%;
}

.tree .arrow {
	border: 1px solid #3b82f6;
	border-radius: 2px;
	padding: 2px 4px;
	font-size: 10px;
	font-weight: bold;
	transition: all 0.2s ease;
  margin-right: 10px;
  
}

.tree .arrow:hover {
	background-color: #3b82f6;
	color: white;
	transform: scale(1.05);
}

.tree-content {
	background-color: #242424;
}
</style>
      