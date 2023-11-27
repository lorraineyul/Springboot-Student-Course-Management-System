import React, { useState, useEffect, Fragment } from "react";
import Container from "./Container";
import Footer from "./Footer";
import "./App.css";
import { getAllStudents, updateStudent, deleteStudent } from "./client";
import AddStudentForm from "./forms/AddStudentForm";
import EditStudentForm from "./forms/EditStudentForm";
import { errorNotification } from "./Notification";
import {
  Table,
  Avatar,
  Spin,
  Button,
  Modal,
  Empty,
  notification,
  Popconfirm,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';

const getIndicatorIcon = () => <Spin size="large" />;


const App = () => {
  const [students, setStudents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] =
    useState(false);
  const [isEditStudentModalVisible, setIsEditStudentModalVisible] =
    useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const openAddStudentModal = () => setIsAddStudentModalVisible(true);
  const closeAddStudentModal = () => setIsAddStudentModalVisible(false);

  const openEditStudentModal = () => setIsEditStudentModalVisible(true);
  const closeEditStudentModal = () => setIsEditStudentModalVisible(false);

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({ message, description });
  };

  const fetchStudents = () => {
    setIsFetching(true);
    getAllStudents()
      .then((res) => res.json())
      .then((students) => {
        console.log(students);
        setStudents(students);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error.error);
        const message = error.error.message;
        const description = error.error.error;
        errorNotification(message, description);
        setIsFetching(false);
      });
  };

  const editUser = (student) => {
    setSelectedStudent(student);
    openEditStudentModal();
  };

  const updateStudentFormSubmitter = (student) => {
    updateStudent(student.studentId, student)
      .then(() => {
        openNotificationWithIcon(
          "success",
          "Student updated",
          `${student.studentId} was updated`
        );
        closeEditStudentModal();
        fetchStudents();
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "error",
          `(${err.error.status}) ${err.error.error}`
        );
      });
  };

  const handleDeleteStudent = (studentId) => {
    deleteStudent(studentId)
      .then(() => {
        openNotificationWithIcon(
          "success",
          "Student deleted",
          `${studentId} was deleted`
        );
        fetchStudents();
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "error",
          `(${err.error.status}) ${err.error.error}`
        );
      });
  };

  const commonElements = (
    <div>
      <Modal
        title="Add new student"
        open={isAddStudentModalVisible}
        onOk={closeAddStudentModal}
        onCancel={closeAddStudentModal}
        width={1000}
      >
        <AddStudentForm
          onSuccess={() => {
            closeAddStudentModal();
            fetchStudents();
          }}
          onFailure={(error) => {
            const message = error.error.message;
            const description = error.error.httpStatus;
            errorNotification(message, description);
          }}
        />
      </Modal>

      <Modal
        title="Edit"
        open={isEditStudentModalVisible}
        onOk={closeEditStudentModal}
        onCancel={closeEditStudentModal}
        width={1000}
      >
        <PageHeader title={`${selectedStudent.studentId}`} />

        <EditStudentForm
          initialValues={selectedStudent}
          submitter={updateStudentFormSubmitter}
        />
      </Modal>

      <Footer
        numberOfStudents={students.length}
        handleAddStudentClickEvent={openAddStudentModal}
      />
    </div>
  );

  if (isFetching) {
    return (
      <Container>
        <Spin indicator={getIndicatorIcon()} />
      </Container>
    );
  }

  if (students && students.length) {
    const columns = [
      {
        title: "",
        key: "avatar",
        render: (text, student) => (
          <Avatar size="large">
            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName
              .charAt(0)
              .toUpperCase()}`}
          </Avatar>
        ),
      },
      {
        title: "Student Id",
        dataIndex: "studentId",
        key: "studentId",
      },
      {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Fragment>
            <Popconfirm
              placement="topRight"
              title={`Are you sure to delete ${record.studentId}`}
              onConfirm={() => handleDeleteStudent(record.studentId)}
              okText="Yes"
              cancelText="No"
              onCancel={(e) => e.stopPropagation()}
            >
              <Button type="danger" onClick={e => e.stopPropagation()}>
                Delete
              </Button>
            </Popconfirm>
            <Button style={{ marginLeft: '5px' }} type="primary" onClick={() => editUser(record)}>
              Edit
            </Button>
          </Fragment>
        ),
      },
    ];

    return (
      <Container>
        <Table
          style={{ marginBottom: "100px" }}
          dataSource={students}
          columns={columns}
          pagination={false}
          rowKey="studentId"
        />
        {commonElements}
      </Container>
    );
  }

  return (
    <Container>
      <Empty description={<h1>No Students found</h1>} />
      {commonElements}
    </Container>
  );
};

export default App;
