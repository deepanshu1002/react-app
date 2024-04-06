import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../utils/dataSlice";

const Body = () => {
  const dispatch = useDispatch();
  const [editBox, setEditBox] = useState({ visible: false, editData: null });
  const [arr, setArr] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(10);

  let name = useRef();
  let email = useRef();
  let role = useRef();
  let count = useRef();

  const apiData = useSelector((store) => store.data.apiData);

  let pages;
  if (apiData) {
    if (apiData.length % pageCount === 0) {
      pages = apiData.length / pageCount;
    } else {
      pages = Math.floor(apiData.length / pageCount) + 1;
    }
  }

  const handleDelete = (id) => {
    dispatch(addData(apiData.filter((data) => data.id !== id)));
  };
  const search = useRef();
  const handleSearchChange = (e) => {
    dispatch(
      addData(
        apiData.filter(
          (data) =>
            data.name
              .toLowerCase()
              .includes(search.current.value.toLowerCase()) ||
            data.email
              .toLowerCase()
              .includes(search.current.value.toLowerCase()) ||
            data.role.toLowerCase().includes(search.current.value.toLowerCase())
        )
      )
    );
  };
  const handleDeleteChecked = () => {
    dispatch(addData(apiData.filter((data) => !arr.includes(data.id))));
  };
  const handleDefaultCheckChange = (e) => {
    if (e.target.checked) {
      let arrCopy = [...arr];
      apiData.map(
        (data) => !arrCopy.includes(data.id) && arrCopy.push(data.id)
      );
      setArr(arrCopy);
    } else {
      setArr([]);
    }
  };
  const handleCheckChange = (e, id) => {
    if (e.target.checked) {
      let arrCopy = [...arr];
      arrCopy.push(id);
      setArr(arrCopy);
    } else {
      let arrCopy = [...arr];
      arrCopy = arrCopy.filter((e) => e != id);
      setArr(arrCopy);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const index = apiData.findIndex((obj) => obj.id === editBox.editData.id);
    if (index !== -1) {
      let obj = {
        id: editBox.editData.id,
        name: name.current.value,
        email: email.current.value,
        role: role.current.value,
      };
      const copyApiData = [...apiData];
      copyApiData.splice(index, 1, obj);

      dispatch(addData(copyApiData));
    }
    setEditBox(false);
  };
  const handlePageClick = (i) => {
    setPage(i);
  };
  const handleEdit = (data) => {
    setEditBox({ visible: true, editData: data });
  };
  const getData = async () => {
    const data = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const json = await data.json();
    dispatch(addData(json));
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      {editBox.visible && (
        <div className="w-1/5  h-1/2 m-auto left-0 right-0 top-0 bottom-0 px-2 pt-12 absolute bg-black bg-opacity-60 ">
          <form onSubmit={(e) => handleSubmit(e)}>
            <label className="text-white" htmlFor="name">
              Name :
            </label>
            <input
              ref={name}
              className="border-[1px]"
              id="name"
              type="text"
              placeholder="name"
              defaultValue={editBox.editData.name}
            />
            <label htmlFor="email">Email :</label>
            <input
              ref={email}
              className="border-[1px]"
              id="email"
              type="text"
              placeholder="email"
              defaultValue={editBox.editData.email}
            />
            <label htmlFor="role">Role :</label>
            <input
              ref={role}
              className="border-[1px]"
              id="role"
              type="text"
              placeholder="role"
              defaultValue={editBox.editData.role}
            />
            <button
              className="mt-2 px-3 py-2 text-white border-2 "
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      <div className="flex justify-center">
        <input
          onChange={handleSearchChange}
          type="text"
          ref={search}
          placeholder="search by name,email or role"
          className=" h-10 w-[98%]   border-gray-400 border-[1px] px-2  mt-4 rounded-md "
        />
      </div>
      <div>
        <input
          type="text"
          className="ml-[40%] mt-4 border-[1px] border-gray-300 w-28 pl-2"
          placeholder="no. of pages"
          ref={count}
        />
        <button
          onClick={() => setPageCount(parseInt(count.current.value))}
          className="px-2 py-1 ml-4"
        >
          {" "}
          done
        </button>
      </div>
      <div className="flex justify-between">
        <div>
          {apiData && (
            <table className="table-auto">
              <thead>
                <tr>
                  <th>
                    <input
                      onChange={handleDefaultCheckChange}
                      type="checkBox"
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiData
                  .slice(page * pageCount, page * pageCount + pageCount)
                  .map((data) => (
                    <tr key={data.id}>
                      <td>
                        <input
                          type="checkBox"
                          checked={arr.includes(data.id)}
                          onChange={(e) => handleCheckChange(e, data.id)}
                        />
                      </td>
                      <td>{data.name}</td>
                      <td>{data.email}</td>
                      <td>{data.role}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(data)}
                          className="pl-2"
                        >
                          📝
                        </button>
                        <button
                          onClick={() => handleDelete(data.id)}
                          className="pl-2"
                        >
                          🪣
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mr-64 mt-10">
          <button
            className="px-6 py-4 rounded-md ml-4 text-white text-bold
             bg-gray-500 "
            onClick={() => {
              if (page - 1 >= 0) setPage(page - 1);
            }}
          >
            previous
          </button>
          {[...Array(pages)].map((_, index) =>
            page === index ? (
              <button
                key={index}
                onClick={() => handlePageClick(index)}
                className="px-6 py-4 rounded-md ml-4 text-white text-bold
             bg-orange-600 "
              >
                {index + 1}
              </button>
            ) : (
              <button
                key={index}
                onClick={() => handlePageClick(index)}
                className="px-6 py-4 rounded-md ml-4 text-white text-bold
             bg-gray-500 "
              >
                {index + 1}
              </button>
            )
          )}
          <button
            onClick={() => {
              if (page + 1 < pages) setPage(page + 1);
            }}
            className="px-6 py-4 rounded-md ml-4 text-white text-bold
             bg-gray-500 "
          >
            next
          </button>
        </div>
      </div>
      <button onClick={handleDeleteChecked} className=" bg-red-700 text-white">
        Delete
      </button>
    </div>
  );
};

export default Body;
