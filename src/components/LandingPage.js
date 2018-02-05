import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as BS from 'react-bootstrap';

const LandingPage = () => {
  const carousel = (
    <BS.Carousel>
      <BS.Carousel.Item>
        <img src="http://placehold.it/900x500"/>
        <BS.Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </BS.Carousel.Caption>
      </BS.Carousel.Item>
      <BS.Carousel.Item>
        <img src="http://placehold.it/900x500"/>
        <BS.Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </BS.Carousel.Caption>
      </BS.Carousel.Item>
      <BS.Carousel.Item>
        <img src="http://placehold.it/900x500"/>
        <BS.Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </BS.Carousel.Caption>
      </BS.Carousel.Item>
    </BS.Carousel>
  );
  const slogan = (
    <BS.Navbar fixedBottom fluid>Find Your Perfect Match</BS.Navbar>
  );
  return (
    <div className="landing-page">
      {carousel}
      {slogan}
    </div>
  );
};

export default LandingPage;
