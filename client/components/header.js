//to add a link in nextjs, we need to use a component created by next
import Link from 'next/link';

//reusable header component for all the pages, whose content changes based on the currentUser
export default ({ currentUser }) => {
  //conditionally toggle which elements to show: create an array of them
  const links = [
    !currentUser && { label: 'sign up', href: '/auth/signup' },
    !currentUser && { label: 'sign in', href: '/auth/signin' },
    currentUser && { label: 'create new', href: '/posts/new' },
    currentUser && { label: 'joined by me', href: '/joins' },
    currentUser && { label: 'created by me', href: '/posts' },
    currentUser && { label: 'sign out', href: '/auth/signout' },
  ]
    //only keep the indices that are not false (the correct links we should show based on which page we are on)
    .filter((link) => link)
    //convert the remaining objects into a html list
    .map((link) => {
      return (
        <li key={link.href} className="nav-item">
          <Link href={link.href}>
            <a className="nav-link">{link.label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Events</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
