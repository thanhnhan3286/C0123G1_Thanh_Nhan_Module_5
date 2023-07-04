import React, {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as yup from "yup";
import * as orderService from "../service/OrderService"
import * as productService from "../service/ProductService"
import {useNavigate, useParams} from "react-router";
import Swal from "sweetalert2";

export function UpdateOrder() {
    const navigate = useNavigate();
    const param = useParams();
    const [productList, setProductList] = useState([]);
    const [productChoose, setProductChoose] = useState(0);
    const [order , setOrder] = useState();
    const getOrder = async () => {
        const res = orderService.findById(param.id);
        setOrder(res);
    }
    const getListProduct = async () => {
        const res = await productService.findAll();
        // console.log(res)
        setProductList(res);
    }
    const getProductChoose = async (id) => {
        console.log('ID: ', +id)
        if (id > 0) {
            setProductChoose(productList.find((p) => p.id === +id));
            console.log(productChoose)
        }
    }
    useEffect(() => {
        getListProduct();
    }, [])
    useEffect(() => {
        getOrder()
    },[param.id])
    if(!order){
        return null;
    }
    return (
        <>
            <Formik
                initialValues={{
                    id:order?.id,
                    buyDay: order?.buyDay,
                    totalPrice: order?.totalPrice,
                    quantity: order?.quantity,
                    product: order?.product,
                    priceProduct:order?.priceProduct,
                    productId:order?.product.id
                }}
                validationSchema={yup.object({
                    buyDay: yup.date().required('Chưa chọn ngày mua').max(new Date, 'Chọn ngày hợp lý'),
                    quantity: yup.number().required('Chưa nhập số lượng sản phẩm').min(1, 'Nhập ít nhất 1 sản phẩm')
                    // product: yup.number().required('Chưa chọn sản phẩm').min(1, 'Chưa chọn sản phẩm')
                })}
                onSubmit={(values, {setSubmitting}) => {
                    setSubmitting(false);
                    const save = async () => {
                        await orderService.save({
                            ...values,
                            product: productChoose,
                            priceProduct: productChoose.price,
                            // totalPrice: +(products.find((p) => p.id === +values.productId)?.price) * values.quantity,
                            totalPrice: +(productChoose.price) * +values.quantity
                        });
                        navigate('/');
                        await Swal.fire({
                            title: 'Thêm mới thành công',
                            icon: 'success',
                            timer: 2000
                        })
                    }
                    save();
                }}>
                {
                    ({isSubmitting}) => (
                        <div className="container boxed" style={{marginTop: "2%", width: "700px", height: "auto"}}>
                            <h2 style={{textAlign: "center", marginTop: "20px"}}>Thêm mới đơn hàng</h2>
                            <div id="form" className="form" style={{marginLeft: "10%", marginRight: "10%"}}>
                                <Form>
                                    <div className="input-group input-group-sm mg">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Chọn sản phẩm</span>
                                        </div>
                                        <Field onChange={(event) => getProductChoose(event.target.value)}
                                               as="select" name="productId" className="form-select">
                                            {
                                                productList.map((pro) => (
                                                        <option
                                                            key={pro.id} value={pro.id}>{pro.name}</option>
                                                    )
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <ErrorMessage name="productId" component="span"
                                                  style={{color: "red", marginLeft: "20px"}}/>
                                    <div className="input-group input-group-sm mg" style={{marginTop: "30px"}}>
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Số lượng</span>
                                        </div>
                                        <Field
                                            type="number" name="quantity" className="form-control" aria-label="Small"
                                            aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <ErrorMessage name="quantity" component="span"
                                                  style={{color: "red", marginLeft: "20px"}}/>
                                    <div className="input-group input-group-sm mg">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Ngày mua</span>
                                        </div>
                                        <Field disabled name="buyDay" type="date" className="form-control" aria-label="Small"
                                               aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <ErrorMessage name="buyDay" component="span"
                                                  style={{color: "red", marginLeft: "20px"}}/>
                                    <div hidden className="input-group input-group-sm mg">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Tổng tiền</span>
                                        </div>
                                        <Field disabled name="totalPrice" type="number" className="form-control"
                                               aria-label="Small"
                                               aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div className="mb-4 text-center mt-4">
                                        <button type="submit" className="btn btn-success">Thêm mới</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    )
                }
            </Formik>

        </>
    )
}