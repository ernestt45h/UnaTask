<template>
  <div class="task">
    <Divider>
      <h1>Task</h1>
    </Divider>
    <!--        <pre>{{task}}</pre>-->
    <Row v-if="loading" type="flex" justify="center">
      <Spin></Spin>
    </Row>
    <Row v-else-if="task" type="flex" justify="center">
      <Col :xs="24" :md="16" :lg="12">
        <Row type="flex" justify="space-around">
          <Col :xs="22">
            <Row v-if="!isEditTitle" type="flex" justify="space-between" align="middle">
              <Col :xs="21">
                <h2 class="mb3">{{task.title | capitalize}}</h2>
              </Col>
              <Col :xs="2">
                <Button
                  size="default"
                  v-if="!isEditTitle"
                  @click="isEditTitle = true"
                  shape="circle"
                  icon="md-brush"
                ></Button>
              </Col>
            </Row>
            <Input v-else v-model="task.title">
              <Icon slot="suffix" @click="titleUpdated" shape="circle" type="md-checkmark"></Icon>
            </Input>
          </Col>
          <Col :xs="22">
            <DatePicker
              :disabled="!isUser"
              style="width: 100%"
              type="datetime"
              class="mb3"
              :value="reminder"
              :placeholder="displayDate.toLocaleString()"
              @on-change="setReminder"
              @on-ok="reminderDone"
              format="yyyy-MM-dd HH:mm"
            ></DatePicker>
          </Col>
          <Col :xs="22">
            <Select
              :disabled="!isUser"
              @on-change="setPriority"
              v-model="task.priority"
              style="width:100%"
              placeholder="Priority"
            >
              <Option value="high">High</Option>
              <Option value="normal">Normal</Option>
              <Option value="low">Low</Option>
            </Select>
          </Col>
          <Col :xs="22">
            <Button
              :disabled="!isUser"
              @click="showParticipants = true"
              class="mb3"
              icon="md-people"
              long
            >{{task.participant.length > 1 ? task.participant.length : null}} Participants</Button>
          </Col>
          <Col :xs="22">
            <Button
              @click="openSubTasks = true"
              class="mb3"
              long
              icon="md-list"
            >{{task.subTasks.length >= 1 ? task.subTasks.length : null}} Sub Tasks</Button>
          </Col>
          <Col :xs="22">
            <Button @click="showNote = true" class="mb3" long icon="md-document">Note</Button>
          </Col>
          <Col :xs="22">
            <Button
              @click="showUpload = true"
              class="mb3"
              long
              icon="md-cloud-upload"
              type="dashed"
            >Attachments</Button>
          </Col>
          <Col :xs="22">
            <Button
              :loading="updating"
              class="mb3"
              @click="updateTask"
              icon="md-cloud-upload"
              v-if="update"
              type="info"
              long
            >Update</Button>
          </Col>
          <Col :xs="22" v-if="!task.completed">
            <Button
              @click="completed(true)"
              class="mb3"
              long
              icon="md-checkmark"
              type="success"
            >Mark as done</Button>
          </Col>
          <Col :xs="22" v-else>
            <Button
              @click="completed(false)"
              class="mb3"
              long
              icon="md-checkmark"
              type="warning"
            >Mark as undone</Button>
          </Col>

          <Col :xs="22" v-if="isUser">
            <Button
              @click="deletionAlert = true"
              class="mb3"
              long
              icon="md-trash"
              type="error"
            >Delete</Button>
          </Col>
        </Row>
      </Col>
    </Row>
    <!--        Deleted Modal-->
    <Modal v-model="deletionAlert" title="Task Deletion">
      <div>
        Deleting this task deletes it permanently.
        You won't be able to retrieve any notification on the task when deleted
      </div>
      <div slot="footer">
        <Row type="flex" justify="end">
          <Button @click="deleteTask" :loading="deleting" type="error">Delete</Button>
          <Button @click="deletionAlert = false">Cancel</Button>
        </Row>
      </div>
    </Modal>
    <!--        Participant Modal-->
    <Modal v-model="showParticipants" fullscreen closable>
      <Row type="flex" justify="space-around" align="top">
        <Col :xs="24" :sm="18" :md="12" :lg="9">
          <Form style="margin-top: 32px">
            <FormItem>
              <Row type="flex" justify="space-between">
                <Col :xs="19">
                  <input
                    v-model="userSearch"
                    placeholder="Search by email..."
                    @keypress.enter.prevent="searchUsers"
                    style="padding: 7px 24px; width: 100%; border: 1px solid #aaa; border-radius: 32px"
                  />
                </Col>
                <Col :xs="4">
                  <Button shape="circle">
                    <Icon @click="searchUsers" type="md-search"></Icon>
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <UserPlaceholder
            v-for="(user, index) in FilterdSearchedUsers"
            v-if="!isSameUser(user.id)"
            :user="user"
            :key="user.id"
          >
            <Button type="success" @click="addParticipant(user, index)">
              <Icon type="md-add"></Icon>
            </Button>
          </UserPlaceholder>
        </Col>
        <Col :xs="24" :sm="18" :md="11" :lg="9">
          <Divider>
            <h2>Participants</h2>
          </Divider>
          <UserPlaceholder
            v-for="(participant, index) in participants"
            :key="participant.id"
            :user="participant"
          >
            <Button disabled type="info">
              <Icon type="md-chatbubbles"></Icon>
            </Button>
            <Button disabled type="success">
              <Icon type="md-call"></Icon>
            </Button>
            <Button v-if="isUser" @click="deleteParticipant(index)" type="warning">
              <Icon type="md-close"></Icon>
            </Button>
          </UserPlaceholder>
        </Col>
      </Row>
      <Row slot="footer" type="flex" justify="end">
        <Button icon="md-close" @click="showParticipants = false">Cancel</Button>
        <Button icon="md-people" type="primary" @click="updateParticipants">Update</Button>
      </Row>
    </Modal>
    <!--        Sub Tasks-->
    <Modal v-model="openSubTasks" closable :title="'\u{1F4C5} Sub tasks'" fullscreen>
      <Row type="flex" justify="center">
        <Col :xs="24">
          <TaskInput @createTask="addSubTask" />
        </Col>
        <Col :xs="22" :md="17" :lg="13" :xl="11" style="margin-top: 32px">
          <TodoList :todos="subTasks" @remove="removeSubTask"></TodoList>
        </Col>
      </Row>
      <Row slot="footer">
        <Button @click="openSubTasks = false">Cancel</Button>
        <Button type="primary" @click="updateSubTasks">Update</Button>
      </Row>
    </Modal>
    <!-- Note -->
    <Modal v-model="showNote" :closable="false">
      <h3 slot="header">Note</h3>
      <Input
        v-model="task.note"
        type="textarea"
        :autosize="{minRows: 3,maxRows: 7}"
        placeholder="Note"
      />
      <Button type="primary" @click="showNote = false" slot="footer">Close</Button>
    </Modal>
    <Modal v-model="showUpload">
      <Upload :before-upload="handleUpload" multiple action="//jsonplaceholder.typicode.com/posts/">
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
      </Upload>
      <List>
        <ListItem>
          <ListItemMeta title="This is title" />
        </ListItem>
        <ListItem>
          <ListItemMeta title="This is title" />
        </ListItem>
        <ListItem>
          <ListItemMeta title="This is title" />
        </ListItem>
      </List>
    </Modal>
  </div>
</template>

<script>
import UserPlaceholder from "../../components/UserPlaceholder";
import TaskInput from "../../components/TaskInput";
import TodoList from "../../components/TodoList";

export default {
  name: "SubTask",
  components: { TodoList, TaskInput, UserPlaceholder },
  watch: {
    "$route.query.id"() {
      this.openSubTasks = false;
      this.getTask();
    }
  },
  computed: {
    isUser() {
      return this.task.createdBy === this.$firebase.auth().currentUser.uid;
    },
    displayDate() {
      typeof this.task.reminder == "string" ? (this.task.reminder = {}) : null;
      console.log(this.task.reminder);
      if (typeof this.task.reminder.start === "object") {
        if (typeof this.task.reminder.start.toDate === "function") {
          console.log(this.task.reminder.start.toDate());
          return this.task.reminder.start.toDate();
        } else return this.task.reminder.start;
      } else if (this.task.reminder.start) {
        return this.task.reminder.start;
      } else {
        return "Reminder";
      }
    },
    FilterdSearchedUsers() {
      return this.searchedUsers.filter(user => {
        for (let id of this.task.participant) {
          return !(user.id === id);
        }
      });
    }
  },
  data() {
    return {
      showUpload: false,
      showNote: false,
      isEditTitle: false,
      loading: true,
      updating: false,
      deleting: false,
      deletionAlert: false,
      task: {},
      update: false,
      reminder: "",
      showParticipants: false,
      userSearch: "",
      searchedUsers: [],
      participants: [],
      subTasks: [],
      openSubTasks: false,
      taskTemplate: {
        title: "",
        note: "",
        tags: [],
        type: "todo",
        reminder: {
          start: "",
          end: ""
        },
        priority: "normal",
        location: "",
        subTasks: [],
        participant: [],
        attachments: [],
        dateCreated: "",
        completed: false
      }
    };
  },
  methods: {
    getTask() {
      this.$Loading.start();
      this.$firebase
        .firestore()
        .collection("tasks")
        .doc(this.$route.query.id)
        .get()
        .then(response => {
          if (response.exists) {
            this.task = { id: response.id, ...response.data() };
            this.reminder = this.displayDate;
            console.log(this.task);
          } else
            this.$Message.error({ content: "Task not found", duration: 10 });
          this.loading = false;
        })
        .then(() => {
          this.participants = [];
          this.subTasks = [];
          this.task.participant.forEach(participant =>
            this.$firebase
              .firestore()
              .collection("users")
              .doc(participant)
              .get()
              .then(ref => {
                this.participants.push({ id: ref.id, ...ref.data() });
              })
              .catch(err => this.$Message.error({ content: err.message }))
          );

          this.task.subTasks.forEach(task => {
            this.$firebase
              .firestore()
              .collection("tasks")
              .doc(task)
              .get()
              .then(ref => {
                this.subTasks.push({ id: ref.id, ...ref.data() });
              })
              .catch(err => this.$Message.error({ content: err.message }));
          });
        })
        .catch(error => {
          this.$Message.error({ content: error.message, duration: 10 });
          this.$Loading.error();
        })
        .finally(_ => {
          this.$Loading.finish();
        });
    },
    titleUpdated() {
      this.isEditTitle = false;
      this.update = true;
    },
    updateTask() {
      this.updating = true;
      let id = this.$route.query.id;
      let task = this.task;
      console.log(task, id);
      this.$firebase
        .firestore()
        .collection("tasks")
        .doc(id)
        .update(task)
        .then(ref => {
          console.log(ref);
          this.$Message.success({ content: "Task updated! :)" });
        })
        .catch(err => {
          this.$Message.error({ content: err.message });
        })
        .finally(_ => {
          this.updating = false;
        });
    },
    updateSubTasks() {
      this.$Modal.confirm({
        title: "Add current participants",
        content: `By clicking Add you will add all participants 
                        taking on the current task. You can later edit it if you want to update 
                        the participants`,
        cancelText: "Don't",
        okText: "Add",
        onOk: this.createSubTasksWithParts,
        onCancel: this.createSubTasks,
        loading: true
      });
    },
    createSubTasks() {
      let subs = this.subTasks.filter(task => {
        return typeof task.id == "undefined";
      });
      let taskIds = [];
      this.$firebase.firestore().runTransaction(transaction => {
        let reqs = [];
        subs.forEach(task => {
          let id = this.$firebase
            .firestore()
            .collection("tasks")
            .doc();
          task.createdBy = this.$firebase.auth().currentUser.uid;
          task.isSub = true;
          reqs.push(transaction.set(id, task));
          taskIds.push(id);
        });
        return Promise.all(reqs)
          .then(_ => {
            taskIds.forEach(ref => {
              console.log(ref.id);
              this.task.subTasks.push(ref.id);
            });
            this.update = true;
            this.openSubTasks = false;
          })
          .catch(error => {
            this.$Message.error({ content: error.message });
          })
          .finally(_ => {
            this.$Modal.remove();
          });
      });
    },
    createSubTasksWithParts() {
      this.subTasks.forEach(task => {
        task.participant = this.participants.map(part => {
          return part.id;
        });
      });
      this.createSubTasks();
    },
    isSameUser(id) {
      return this.$firebase.auth().currentUser.uid == id;
    },
    setReminder(date) {
      this.reminder = new Date(date);
    },
    reminderDone() {
      if (typeof this.task.reminder == "string") this.task.reminder = {};
      this.task.reminder.start = this.reminder;
      this.update = true;
    },
    completed(bool) {
      this.$firebase
        .firestore()
        .collection("tasks")
        .doc(this.$route.query.id)
        .update({ completed: bool })
        .then(_ => {
          this.task.completed = bool;
        });
    },
    setPriority(priority) {
      this.task.priority = priority;
      this.update = true;
    },
    deleteTask() {
      this.deleting = true;
      this.$firebase
        .firestore()
        .collection("tasks")
        .doc(this.$route.query.id)
        .delete()
        .then(_ => {
          this.$router.go(-1);
        })
        .catch(error =>
          this.$Message.error({ content: error.message, duration: 5 })
        )
        .finally(_ => {
          this.deleting = false;
        });
    },
    searchUsers() {
      this.$Loading.start();
      this.$firebase
        .firestore()
        .collection("users")
        .where("email", ">=", this.userSearch)
        .where("email", "<=", this.userSearch + "\uf8ff")
        .limit(5)
        .get()
        .then(refs => {
          this.searchedUsers = refs.docs.map(ref => {
            return { id: ref.id, ...ref.data() };
          });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(_ => {
          this.$Loading.finish();
        });
    },
    addParticipant(user, remove) {
      let participants = [...this.participants];
      participants.push(user);
      this.participants = [...new Set(participants)];
      this.searchedUsers.splice(remove, 1);
    },
    deleteParticipant(index) {
      this.participants.splice(index, 1);
    },
    updateParticipants() {
      this.task.participant = this.participants.map(user => {
        return user.id;
      });
      this.update = true;
      this.showParticipants = false;
    },
    addSubTask(task) {
      this.subTasks.push(task);
      console.log(this.subTasks, task);
    },
    removeSubTask(index) {
      console.log(index);
      this.subTasks.splice(index, 1);
    },
    handleUpload(files) {
      console.log(files);
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getTask();
    } else {
      this.task.title = "Task not found";
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.mb3 {
  margin: 7px 0;
}

.task {
  margin-bottom: 150px;
}
</style>