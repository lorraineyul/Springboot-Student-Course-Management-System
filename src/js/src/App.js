import React, { useState, useEffect } from "react";
import "./App.css";
import { getAllStudents } from "./client";
import { Table, Avatar, Spin, Modal } from "antd";
import Container from "./Container";
import Footer from "./Footer";
import { LoadingOutlined } from "@ant-design/icons";
import AddStudentForm from "./forms/AddStudentForm";
import { errorNotification } from "./Notification";
import { Empty } from "antd";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const getIndicatorIcon = () => (
    <LoadingOutlined style={{ fontSize: 24 }} spin />
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setFetchingStudents(true);
    getAllStudents()
      .then((res) =>
        res.json().then((students) => {
          console.log(students);
          setStudents(students);
          setLoading(false);
        })
      )
      .catch((error) => {
        console.log(error.error);
        const message = error.error.message;
        const description = error.error.error;
        errorNotification(message, description);
        setFetchingStudents(false);
      });
  };

  const openStudentModal = () => {
    setModalVisible(true);
  };

  const closeStudentModal = () => {
    setModalVisible(false);
  };

  const commonElements = () => {
    return (
      <div>
        <Modal
          title="Add new student"
          visible={modalVisible}
          onCancel={closeStudentModal}
          onOk={closeStudentModal}
          width={1000}
        >
          <AddStudentForm
            onSuccess={() => {
              closeStudentModal();
              fetchStudents();
            }}
            onFailure={(error) => {
              const message = error.error.message;
              const description = error.error.httpStatus;
              errorNotification(message, description);
            }}
          />
        </Modal>
  
        <Footer
          numberOfStudents={students.length}
          handleAddStudentClickEvent={openStudentModal}
        />
      </div>
    );
  };
  

  const large = true;

  if (loading) {
    // Display Spin component during loading
    return (
      <Container>
        <Spin indicator={getIndicatorIcon} />
      </Container>
    );
  }

  if (students && students.length) {

    const columns = [
      {
        title: "",
        key: "avatar",
        render: (text, student) => (
          <Avatar size={large}>
            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName
              .charAt(0)
              .toUpperCase()}`}
          </Avatar>
        ),
      },
      {
        title: "StudentId",
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
        {commonElements()}
      </Container>
    );
  }

  return (
    <Container>
      <Empty description={<h1>No students found</h1>} />
      {commonElements()}
    </Container>
  );
}

export default App;
