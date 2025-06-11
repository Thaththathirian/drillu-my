import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCourses } from "store/slices/coursesSlice";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { CgAdd } from "react-icons/cg";
import { Link } from "react-router-dom";

const Courses = () => {
  const dispatch = useDispatch();
  const { collegeId } = useParams();
  const { courses, status } = useSelector((state) => state.courses);

  console.log("Courses Component - collegeId:", collegeId);
  console.log("Courses Component - status:", status);
  console.log("Courses Component - courses:", courses);

  useEffect(() => {
    console.log("Courses useEffect - collegeId:", collegeId);
    if (collegeId) {
      dispatch(fetchCourses(collegeId));
    }
  }, [dispatch, collegeId]);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-primary">
            <CardBody className="pb-0">
              <div className="text-value">
                <Link to={`/${collegeId}/courses/add`} className="text-white">
                  <CgAdd size={24} /> Add New Course
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Courses
            </CardHeader>
            <CardBody>
              {status === "loading" && <div>Loading courses...</div>}
              {status === "failed" && <div>Error loading courses</div>}
              {status === "succeeded" && (
                <table className="table table-responsive-sm table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{course.description}</td>
                        <td>
                          <Link
                            to={`/${collegeId}/courses/${course.id}`}
                            className="btn btn-primary"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Courses;
