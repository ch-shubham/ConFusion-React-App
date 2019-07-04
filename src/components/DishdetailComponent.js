import React,{Component} from 'react';
import { Card, CardImg, CardText, CardBody,
    Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label, CardTitle, Breadcrumb, BreadcrumbItem,Button,Row,Col} from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { Link } from 'react-router-dom';


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderDish({dish}) {
        if (dish != null)
            return(
                <div className="col-12 col-md-5 m-1">
                <Card>
                    <CardImg top src={dish.image} alt={dish.name} />
                    <CardBody>
                      <CardTitle>{dish.name}</CardTitle>
                      <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
                </div>
            );
    }

    function RenderComments({comments, addComment, dishId}) {
        if(comments !== null)
        return(
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    {comments.map((comment) => {
                        return(
                            <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>--{comment.author + ',' + new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}   </p>
                            </li>
                        );
                    })}
                </ul>
                <CommentForm dishId={dishId} addComment={addComment} />
            </div>
        );
    }

    class CommentForm extends Component{

        constructor(props){
            super(props);
            this.state = {
                isModalOpen: false     
            }
            this.toggleModal = this.toggleModal.bind(this);
            this.RenderComments = this.RenderComments.bind(this);
        }

        toggleModal() {
            this.setState({
              isModalOpen: !this.state.isModalOpen
            });
          }

          RenderComments(values) {
            this.toggleModal();
            this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
            // console.log('Current State is: ' + JSON.stringify(values));
            // alert('Current State is: ' + JSON.stringify(values));
    
        }


        render(){
            return(
                <div>
                    <Button outline onClick={this.toggleModal} className="mt-3"><span className="m-2 fa fa-pencil fa-lg"></span>Submit Comment</Button>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Comment</ModalHeader>
                    <ModalBody>
                    <LocalForm onSubmit={this.RenderComments}>
                            <Row className="form-control">
                                <Label htmlFor="rating">Rating</Label>
                                <Col md={10}>
                                    <Control.select 
                                        model=".ratings" 
                                        name="ratings"
                                        id="ratings"
                                        className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                    </Control.select>
                                </Col>

                                <Label htmlFor="author">Your Name</Label>
                                <Col md={10}>
                                    <Control.text
                                        className="form-control"
                                        model=".author" 
                                        id="author"
                                        name="author"
                                        validators={{required,minLength: minLength(3), maxLength: maxLength(15)}}
                                            />
                                    <Errors 
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>

                                <Label htmlFor="comment">Comment</Label>
                                <Col md={10}>
                                    <Control.textarea 
                                        className="form-control"
                                        model=".comment" 
                                        rows="6" 
                                        id="comment" 
                                        name="comment"
                                        />
                                 </Col>

                            </Row>
                            <Button type="submit" value="submit" color="primary">Submit comment</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                </div>
            );
        }
    }

    const  DishDetail = (props) => {
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null) 
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>

                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className="row">
                            <RenderDish dish={props.dish} />
                            <RenderComments comments={props.comments}
                                addComment={props.addComment}
                                dishId={props.dish.id}
                            />
                            
                    </div>
                 </div>
        );
    }



export default DishDetail;