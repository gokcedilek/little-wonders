import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
//import Calendar from 'react-calendar';
//import DateTimePicker from 'react-datetime-picker';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescr] = useState('');
  const [location, setLocation] = useState('');
  //2014-12-13 12:34 PM YYYY-MM-DD HH:MM AM/PM
  const [time, setTime] = useState('2014-12-13 12:34 PM');
  const [numPeople, setNumPeople] = useState(2);

  const { doRequest, errors } = useRequest({
    url: '/api/posts',
    method: 'post',
    body: {
      title,
      description,
      numPeople,
      location,
      time,
    },
    onSuccess: (post) => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div>
      <h1>Create a Post</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            value={description}
            onChange={(e) => setDescr(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-control"
          />
        </div>
        {/* <div>
          <DateTimePicker value={time} onChange={(time) => setTime(time)} />
        </div> */}
        <div className="form-group">
          <label>Number of Volunteers</label>
          <input
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewPost;